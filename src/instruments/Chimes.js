const Tone = require('tone')

class Chimes {
  constructor(opts) {
    this.attack = opts.attack
    this.decay = opts.decay
    this.sustain = opts.sustain
    this.release = opts.release
    this.baseFrequency = opts.baseFrequency
    this.gain = opts.volume
  
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
        attack : this.attack ,
        decay : this.decay,
        sustain : this.sustain,
        release : this.release,
        baseFrequency: this.baseFrequency,
        octaves: 2.7
      }
    })

    this.filter = new Tone.Filter();
    this.delayVolume = new Tone.Gain();
    this.volume = new Tone.Gain();
    this.delay = new Tone.FeedbackDelay(0.25, 0.3)
    this.lfo = new Tone.LFO(5, 1200, 10000)

    this.synth.connect(this.filter);
    this.lfo.connect(this.filter.frequency).start()
    this.filter.connect(this.volume);
    this.volume.toMaster();

    // Delay
    this.filter.connect(this.delay);
    this.delay.connect(this.delayVolume)
    this.delayVolume.toMaster()
    this.delayVolume.gain.value = 0.2    
    
    this.volume.gain.value = 127 / 127; // 0-0.8
  }

  toggleSound(type, input) {
    let method = type === 144 ? 'triggerAttack' : 'triggerRelease';
    console.log('input : note', input, method)
    this.synth[method](input);
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

module.exports = Chimes