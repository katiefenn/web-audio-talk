const Tone = require('tone')

class HiHat {
  constructor() {
    const ratios = [80, 120, 166.4, 217.2, 271.6, 328.4]

    const bandpass = new Tone.Filter({
      type: 'bandpass',
      frequency: 10000
    })
    
    // Highpass
    const highpass = new Tone.Filter({
      type: 'highpass',
      frequency: 7000
    })
    
    this.synth = new Tone.PolySynth(6, Tone.Synth).chain(bandpass).chain(highpass, Tone.Master)
    this.synth.set({
      volume: -10,
      oscillator: {
        type: 'square'
      },
      envelope: {
        attack: 0.001,
        attackCurve: 'exponential',
        decay: 0.1,
        decayCurve: 'exponential',
        sustain: 0.0,
        release: 0.1,
        releaseCurve: 'exponential'
      }
    })

    function callback(time, note){
      //the notes given as the second element in the array
      //will be passed in as the second argument
      if (note) {
        this.synth.triggerAttackRelease(ratios, "16n", time);
      }
    }

    const _ = null
    const O = 1

    //Bass sequence 1
    var seq = new Tone.Sequence(callback.bind(this), [
      [_, _, O, O], [_, _, O, O], [_, _, O, O], [_, _, O, O],
      [_, _, O, O], [_, _, O, O], [_, _, O, O], [_, _, O, O],
      [_, _, O, O], [_, _, O, O], [_, _, O, O], [_, _, O, O],
      [_, _, O, O], [_, _, O, O], [_, _, O, O], [_, _, O, O]
    ]).start();
  }

  handleMIDIEvent (event) {
    this.synth.triggerAttackRelease('C1', '8n')
  }
}

function mapMidiToBass ({ type, input }) {
  return 'keydown'
}

module.exports = HiHat