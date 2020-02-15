const Tone = require('tone')

class Bass {
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

module.exports = Bass