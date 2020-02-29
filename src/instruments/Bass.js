const Tone = require('tone')
const mapMIDINumberToTone = require('../utils/mapMIDIToTone')

class Bass {
  constructor() {
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      volume: 1,
      oscillator : {
        type : "sawtooth"
      },
      envelope : {
        attack : 0.001 ,
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
        attack : 0.001 ,
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
    this.volume.gain.value = 1.3; // 0-0.8
    this.volume2.gain.value = 6 / 127; // 0-0.8

    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
  }

  handleMIDIEvent (event) {
    const type = mapMidiToBass(event)

    switch (type) {
      case 'keydown':
        this.synth.triggerAttack(mapMIDINumberToTone(event.input))
        this.synth2.triggerAttack(mapMIDINumberToTone(event.input))
        break
      case 'keyup':
        this.synth.triggerRelease(mapMIDINumberToTone(event.input))
        this.synth2.triggerRelease(mapMIDINumberToTone(event.input))
        break
      case 'volume':
        this.volume.gain.value = event.value / 127
        break
      case 'volume2':
        this.volume.gain.value = event.value / 127
        break
      case 'filter':
        this.volume.gain.value = event.value / 127
        break
      case 'filter2':
        this.volume2.gain.value = event.value / 127
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
        this.synth[method]('G1')
        break
      case 'w':
        this.synth[method]('A1')
        break
      case 'e':
        this.synth[method]('B1')
        break
      case 'r':
        this.synth[method]('C2')
        break
      case 't':
        this.synth[method]('D2')
        break
      case 'y':
        this.synth[method]('E2')
        break
      case 'u':
        this.synth[method]('F2')
        break
      case 'i':
        this.synth[method]('F#2')
        break
    }
  }

  handleSequenceEvent (time, note) {
    const [pitch, length] = note.split(':')
    this.synth.triggerAttackRelease(note, length, time);
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
      20: /* C1 */ 'volume',
      21: /* C2 */ 'volume2',
      22: /* C10 */ 'filter',
      23: /* C11 */ null,
      61: /* C12 */ null,
      24: /* C13 */ null,
      26: /* C14 */ 'filter2',
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

module.exports = Bass