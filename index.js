const Tone = require('tone')

console.clear();

class MIDIAccess {
  constructor(args = {}) {
    this.onDeviceInput = args.onDeviceInput || console.log;
  }

  start() {
    return new Promise((resolve, reject) => {
      this._requestAccess().then(access => {
        this.initialize(access);
        resolve();
      }).catch(() => reject('Something went wrong.'));
    });
  }

  initialize(access) {
    const devices = access.inputs.values();
    for (let device of devices) this.initializeDevice(device);
  }

  initializeDevice(device) {
    device.onmidimessage = this.onMessage.bind(this);
  }
  
  onMessage(message) {
    let [type, input, value] = message.data;
    this.onDeviceInput({ type, input, value });
  }

  _requestAccess() {
    return new Promise((resolve, reject) => {
      if (navigator.requestMIDIAccess)
        navigator.requestMIDIAccess()
          .then(resolve)
          .catch(reject);
      else reject();
    });
  }
}

class Baseline {
  constructor() {
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      volume: 1,
      oscillator : {
        type : "sawtooth"
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.00001
      }
    })
    this.synth2 = new Tone.PolySynth(4, Tone.Synth, {
      volume: 1,    
      oscillator : {
        type : "sawtooth"
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.00001
      }
    }).set("detune", 1200)

    this.filter = new Tone.Filter();
    this.filter2 = new Tone.Filter();
    this.volume = new Tone.Gain();
    this.volume2 = new Tone.Gain();

    this.synth.connect(this.filter);
    this.synth2.connect(this.filter2);
    this.filter.connect(this.volume);
    this.filter2.connect(this.volume2);
    this.volume.toMaster();
    this.volume2.toMaster();
    
    this.filter.frequency.value = 2 / 127 * 10800; // 200 - 15000
    this.filter2.frequency.value = 2 / 127 * 10800; // 200 - 15000
    this.volume.gain.value = 68 / 127; // 0-0.8
    this.volume2.gain.value = 6 / 127; // 0-0.8
  }

  toggleSound(type, input) {
    let method = type === 144 ? 'triggerAttack' : 'triggerRelease';
    console.log('input : note', input, mapMIDINumberToTone(input))
    this.synth[method](mapMIDINumberToTone(input));
    this.synth2[method](mapMIDINumberToTone(input));
  }

  handleVolume(value) { // 0-127
    let val = value / 127; // Target: 124
    this.volume.gain.value = val;
  }

  handleVolume2(value) { // 0-127
    let val = value / 127; // Target: 28
    this.volume2.gain.value = val;
  }

  handleFilter(value) { // 0-127
    let val = value / 127 * 10800; // Target: 2
    this.filter.frequency.value = val;
  }

  handleFilter2(value) { // 0-127
    let val = value / 127 * 10800; // Target: 26
    this.filter2.frequency.value = val;
  }
}

class Chimes {
  constructor() {
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      volume: 1,
      oscillator : {
        type : "sawtooth"
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.00001
      }
    })
    this.synth2 = new Tone.PolySynth(4, Tone.Synth, {
      volume: 1,    
      oscillator : {
        type : "sawtooth"
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.2,
        release : 0.00001
      }
    }).set("detune", 1200)

    this.filter = new Tone.Filter();
    this.filter2 = new Tone.Filter();
    this.volume = new Tone.Gain();
    this.volume2 = new Tone.Gain();
    this.delay = new Tone.FeedbackDelay(0.2, 0.3).toMaster()
    this.delay.connect(this.volume2)

    this.synth.connect(this.filter);
    //this.synth2.connect(this.filter2);
    this.filter.connect(this.volume);
    //this.filter.connect(this.delay);
    this.filter2.connect(this.volume2);
    this.volume.toMaster();
    this.volume2.toMaster();
    
    this.filter.frequency.value = 127 / 127 * 10800; // 200 - 15000
    this.filter2.frequency.value = 30 / 127 * 10800; // 200 - 15000
    this.volume.gain.value = 127 / 127; // 0-0.8
    this.volume2.gain.value = 6 / 127; // 0-0.8
  }

  toggleSound(type, input) {
    let method = type === 144 ? 'triggerAttack' : 'triggerRelease';
    console.log('input : note', input, mapMIDINumberToTone(input + 12))
    this.synth[method](mapMIDINumberToTone(input + 12));
    //this.synth2[method](mapMIDINumberToTone(input));
  }

  handleVolume(value) { // 0-127
    let val = value / 127; // Target: 124
    this.volume.gain.value = val;
  }

  handleVolume2(value) { // 0-127
    let val = value / 127; // Target: 28
    this.volume2.gain.value = val;
  }

  handleFilter(value) { // 0-127
    let val = value / 127 * 10800; // Target: 2
    this.filter.frequency.value = val;
  }

  handleFilter2(value) { // 0-127
    let val = value / 127 * 10800; // Target: 26
    this.filter2.frequency.value = val;
  }
}

// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
var started = false;
document.documentElement.addEventListener('mousedown', () => {
  if (started) return;
  started = true;
  const inst = new Chimes();
  const midi = new MIDIAccess({ onDeviceInput });
  midi.start().then(() => {
    console.log('STARTED!');
  }).catch(console.error);

  document.onkeyup = e => {
    console.log(e)
  }

  function onDeviceInput({ type, input, value }) {
    if (input > 35 && input < 97) inst.toggleSound(type, input);
    else if (input === 22) inst.handleVolume(value);
    else if (input === 23) inst.handleVolume2(value);
    else if (input === 26) inst.handleFilter(value);
    else if (input === 27) inst.handleFilter2(value);
    console.log('onDeviceInput!', type, input, value);
  }
});


function mapMIDINumberToTone (number) {
    return {
        "36": "C0",
        "37": "C#0",
        "38": "D0",
        "39": "D#0",
        "40": "E0",
        "41": "F0",
        "42": "F#0",
        "43": "G0",
        "44": "G#0",
        "45": "A0",
        "46": "A#0",
        "47": "B0",
        "48": "C1",
        "49": "C#1",
        "50": "D1",
        "51": "D#1",
        "52": "E1",
        "53": "F1",
        "54": "F#1",
        "55": "G1",
        "56": "G#1",
        "57": "A1",
        "58": "A#1",
        "59": "B1",
        "60": "C2",
        "61": "C#2",
        "62": "D2",
        "63": "D#2",
        "64": "E2",
        "65": "F2",
        "66": "F#2",
        "67": "G2",
        "68": "G#2",
        "69": "A2",
        "70": "A#2",
        "71": "B2",
        "72": "C3",
        "73": "C#3",
        "74": "D3",
        "75": "D#3",
        "76": "E3",
        "77": "F3",
        "78": "F#3",
        "79": "G3",
        "80": "G#3",
        "81": "A3",
        "82": "A#3",
        "83": "B3",
        "84": "C4",
        "85": "C#4",
        "86": "D4",
        "87": "D#4",
        "88": "E4",
        "89": "F4",
        "90": "F#4",
        "91": "G4",
        "92": "G#4",
        "93": "A4",
        "94": "A#4",
        "95": "B4",
        "96": "C5",
        "97": "C#5",
        "98": "D5",
        "99": "D#5",
        "100": "E5",
        "101": "F5",
        "102": "F#5",
        "103": "G5",
        "104": "G#5",
        "105": "A5",
        "106": "A#5",
        "107": "B5",
        "108": "C6"
    }[number]
}
