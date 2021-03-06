const Tone = require('tone')

class Kick {
  constructor() {
    this.sampler = new Tone.Sampler({
      'C1': require('../samples/Kick.wav'),
      'C2': require('../samples/Clap.wav')
    })

    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
    this.volume = new Tone.Gain()
    this.sampler.connect(this.volume)
    this.volume.gain.value = 0.9
    this.volume.toMaster()
    this.handleMIDIEvent = this.handleMIDIEvent.bind(this)
  }

  handleMIDIEvent (event) {
    this.sampler.triggerAttackRelease('C1')
  }

  handleSequenceEvent (time, note){
    //the notes given as the second element in the array
    //will be passed in as the second argument
    console.log(Tone.Time(time).toBarsBeatsSixteenths())
    this.sampler.triggerAttackRelease(note);
  }
}

function mapMidiToBass ({ type, input }) {
  return 'keydown'
}

module.exports = Kick