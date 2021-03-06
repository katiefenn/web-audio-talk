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
    this.lfo = new Tone.LFO(5, 2000, 10000)

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

    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
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

  handleQwertyEvent (event) {
    const method = event.type === 'keydown' ? 'triggerAttack' : 'triggerRelease'
    switch (event.key) {
      case 'q':
        this.synth[method]('D4')
        break
      case 'w':
        this.synth[method]('E4')
        break
      case 'e':
        this.synth[method]('F4')
        break
      case 'r':
        this.synth[method]('G4')
        break
      case 't':
        this.synth[method]('A4')
        break
      case 'y':
        this.synth[method]('B4')
        break
      case 'u':
        this.synth[method]('C5')
        break
      case 'i':
        this.synth[method]('D5')
        break
      case 'o':
        this.synth[method]('E5')
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

module.exports = Chimes