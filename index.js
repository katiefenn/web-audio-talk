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
    //console.log('input : note', input, mapMIDINumberToTone(input))
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
    this.attack = 36 / 1000
    this.decay = 46 / 1000
    this.sustain = 63 / 127 
    this.release = 42 / 100
  
    this.synth = new Tone.PolySynth(4, Tone.MonoSynth, {
      oscillator : {
        type : "pulse",
        width: 0.01
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.00001
      },
      filterEnvelope: {
        attack : 0.06 ,
        decay : 0.2 ,
        sustain : 0.5 ,
        release : 2 ,
        baseFrequency: "A7",
        octaves: 2.7
      }
    })

    this.filter = new Tone.Filter();
    this.volume = new Tone.Gain();

    this.synth.connect(this.filter);
    this.filter.connect(this.volume);
    this.volume.toMaster();
    
    this.filter.frequency.value = 127 / 127 * 10800; // 200 - 15000
    this.volume.gain.value = 127 / 127; // 0-0.8
  }

  toggleSound(type, input) {
    let method = type === 144 ? 'triggerAttack' : 'triggerRelease';
    console.log('input : note', input, mapMIDINumberToTone(input + 12), method)
    this.synth[method](mapMIDINumberToTone(input + 12));
    //this.synth2[method](mapMIDINumberToTone(input));
  }

  handleVolume(value) { // 0-127
    let val = value / 127; // Target: 124
    this.volume.gain.value = val;
  }

  handleFilter(value) { // 0-127
    let val = value / 127 * 10800; // Target: 2
    this.filter.frequency.value = val;
  }

  handleAttack(value) {
    let val = value / 1000
    this.synth.voices[0].filterEnvelope.attack = val
  }

  handleDecay(value) {
    let val = value / 1000
    this.synth.voices[0].filterEnvelope.decay = val
  }

  handleSustain(value) {
    let val = value / 127
    this.synth.voices[0].filterEnvelope.sustain = val
  }

  handleRelease(value) {
    let val = value / 100
    this.synth.voices[0].filterEnvelope.release = val
  }

  handleBaseFrequency(value) {
    this.synth.voices[0].filterEnvelope.baseFrequency = value
  }
}

// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
var started = false;
document.documentElement.addEventListener('mousedown', () => {
  if (started) return;
  started = true;
  const midi = new MIDIAccess({ onDeviceInput });
  midi.start().then(() => {
    console.log('STARTED!');
  }).catch(console.error);

  document.onkeydown = onKeyboardInput

  document.onkeyup = onKeyboardInput
  
  function onKeyboardInput(e) {
    const type = e.type === 'keydown' ? 144 : 123
    switch (e.key) {
      case 'a':
        inst.toggleSound(type, 72)
        break
      case 's':
        inst.toggleSound(type, 74)
        break
      case 'd':
        inst.toggleSound(type, 76)
        break
      case 'f':
        inst.toggleSound(type, 77)
        break
      case 'g':
        inst.toggleSound(type, 79)
        break
      case 'h':
        inst.toggleSound(type, 81)
        break
      case 'j':
        inst.toggleSound(type, 83)
        break
      // case 'k':
      //   inst.toggleSound(type, 84)
      //   break
    }
  }
  
  // Baseline
  // const inst = new Baseline();
  // function onDeviceInput({ type, input, value }) {
  //   if (input > 35 && input < 97) inst.toggleSound(type, input);
  //   else if (input === 22) inst.handleVolume(value);
  //   else if (input === 23) inst.handleVolume2(value);
  //   else if (input === 26) inst.handleFilter(value);
  //   else if (input === 27) inst.handleFilter2(value);
  //   console.log('onDeviceInput!', type, input, value);
  // }

  // Chimes
  const inst = new Chimes();
  function onDeviceInput({ type, input, value }) {
    if (input > 35 && input < 97) inst.toggleSound(type, input);
    else if (input === 20) inst.handleVolume(value);
    else if (input === 22) inst.handleAttack(value);
    else if (input === 23) inst.handleDecay(value);
    else if (input === 24) inst.handleSustain(value);
    else if (input === 25) inst.handleRelease(value);
    else if (input === 26) inst.handleBaseFrequency(value * 100);
    else if (input === 27) inst.handleFilter(value);
    else console.log('onDeviceInput!', type, input, value);
  }
});


function mapMIDINumberToTone (number) {
  return [
    "C0",
    "C#0",
    "D0",
    "D#0",
    "E0",
    "F0",
    "F#0",
    "G0",
    "G#0",
    "A0",
    "A#0",
    "B0",
    "C1",
    "C#1",
    "D1",
    "D#1",
    "E1",
    "F1",
    "F#1",
    "G1",
    "G#1",
    "A1",
    "A#1",
    "B1",
    "C2",
    "C#2",
    "D2",
    "D#2",
    "E2",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
    "F5",
    "F#5",
    "G5",
    "G#5",
    "A5",
    "A#5",
    "B5",
    "C6"
  ][(number - 36) % 72]
}
