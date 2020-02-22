const Tone = require('tone')
const mapMIDINumberToTone = require('../utils/mapMIDIToTone')

class Chimes {
  constructor() {
    this.attack = 6 / 100
    this.decay = 20 / 200
    this.sustain = 50 / 100
    this.release = 1 / 1000
    this.baseFrequency = 10000
    this.gain = 1
  
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      oscillator : {
        type : "pulse",
        width: 0.01
      },
      envelope : {
        attack : 0.00001 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.00001
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
    
    this.volume.gain.value = 40 / 127; // 0-0.8

    const _ = null

    function callback(time, note){
      //the notes given as the second element in the array
      //will be passed in as the second argument
      this.synth.triggerAttackRelease(note, "16n", time);
    }

    var seq = new Tone.Sequence(callback.bind(this), [
      [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
      ["D5", _, "C5", _], ["B4", _, "A4", _], ["G4", _, "A4", _], ["G4", _, "A4", "B4"],
      [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
      ["E5", _, "D5", _], ["C5", _, "B4", _], ["A4", _, "B4", _], ["A4", _, "B4", "E4"],
    ]).start();
  }

  handleMIDIEvent (event) {
    const type = mapMidiToBass(event)

    switch (type) {
      case 'keydown':
        this.synth.triggerAttack(mapMIDINumberToTone(event.input + 24))
        break
      case 'keyup':
        this.synth.triggerRelease(mapMIDINumberToTone(event.input + 24))
        break
      case 'detune':
        this.synth.set('detune', (event.value - 64) * 15)
        break
    }
  }
}

function mapMidiToBass ({ type, input }) {
  const mappings = {
    // Keydown
    144: Array(61).fill(undefined).map((item, index) => index + 36).reduce((acc, item) => Object.assign(acc, { [item]: 'keydown' }), {}),
    // Keyup
    128: Array(61).fill(undefined).map((item, index) => index + 36).reduce((acc, item) => Object.assign(acc, { [item]: 'keyup' }), {}),
    // Faders and dials
    176: {
      20: /* C1 */ null,
      21: /* C2 */ null,
      22: /* C10 */ null,
      23: /* C11 */ null,
      61: /* C12 */ null,
      24: /* C13 */ null,
      26: /* C14 */ null,
      27: /* C15 */ null,
      62: /* C16 */ null,
      95: /* C17 */ null
    },
    // Pitch bend
    224: {
      0: /* C31 */ 'detune'
    }
  }

  if (mappings[type]) {
    console.info(`Mapped ${type}, ${input} to: `, mappings[type][input])
    return mappings[type][input]
  }

  console.info(`Mapped ${type}, ${input} to: `, null)
  return null
}

module.exports = Chimes