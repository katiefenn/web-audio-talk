const Tone = require('tone')
const mapMIDINumberToTone = require('../utils/mapMIDIToTone')

class Vocoder {
  constructor() {
    this.attack = 6 / 100
    this.decay = 20 / 200
    this.sustain = 50 / 100
    this.release = 1 / 1000
    this.baseFrequency = 10000
    this.gain = 1
  
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      oscillator : {
        type : "sawtooth",
        width: 0.01
      },
      envelope : {
        attack : 0.005 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.1
      }
    }).toMaster()

    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
  }

  handleMIDIEvent (event) {
    const type = mapMidiToBass(event)

    switch (type) {
      case 'keydown':
        this.synth.triggerAttack(mapMIDINumberToTone(event.input + 12))
        break
      case 'keyup':
        this.synth.triggerRelease(mapMIDINumberToTone(event.input + 12))
        break
      case 'detune':
        this.synth.set('detune', (event.value - 64) * 6)
        break
    }
  }

  handleQwertyEvent (event) {
    const method = event.type === 'keydown' ? 'triggerAttack' : 'triggerRelease'
    switch (event.key) {
      case 'q':
        this.synth[method]('G2')
        break
      case 'w':
        this.synth[method]('A2')
        break
      case 'e':
        this.synth[method]('B2')
        break
      case 'r':
        this.synth[method]('C3')
        break
      case 't':
        this.synth[method]('D3')
        break
      case 'y':
        this.synth[method]('E3')
        break
      case 'u':
        this.synth[method]('F3')
        break
      case 'i':
        this.synth[method]('F#3')
        break
    }
  }

  handleSequenceEvent (time, note) {
    //the notes given as the second element in the array
    //will be passed in as the second argument
    this.synth.triggerAttackRelease(note, "18n", time);
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

module.exports = Vocoder