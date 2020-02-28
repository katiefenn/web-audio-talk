const Tone = require('tone')
const mapMIDINumberToTone = require('../utils/mapMIDIToTone')

class Metronome {
  constructor() {
    this.synth = new Tone.PolySynth(4, Tone.Synth, {
      volume: 0.01,
      oscillator : {
        type : "sawtooth"
      }
    })

    this.volume = new Tone.Gain();
    this.synth.connect(this.volume);
    this.volume.gain.value = 10 / 127; // 0-0.8
    this.volume.toMaster();

    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
  }

  handleMIDIEvent (event) {
    const type = mapMidiToMetronome(event)

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

  handleSequenceEvent (time, note) {
    //the notes given as the second element in the array
    //will be passed in as the second argument
    this.synth.triggerAttackRelease(note, "64n", time);
  }
}

function mapMidiToMetronome ({ type, input }) {
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

module.exports = Metronome