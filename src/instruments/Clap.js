const Tone = require('tone')

class Clap {
  constructor() {
    this.sampler = new Tone.Sampler({
      'C1': require('../samples/Clap.wav')
    })

    this.volume = new Tone.Gain()
    this.sampler.connect(this.volume)
    this.volume.gain.value = 0.4
    this.volume.toMaster()
    this.handleMIDIEvent = this.handleMIDIEvent.bind(this)
    this.handleSequenceEvent = this.handleSequenceEvent.bind(this)
  }

  handleMIDIEvent (event) {
    this.sampler.triggerAttackRelease('C1')
  }

  handleSequenceEvent (time, note){
    //the notes given as the second element in the array
    //will be passed in as the second argument
    console.log(Tone.Time(time).toBarsBeatsSixteenths())
    this.sampler.triggerAttackRelease('C1');
  }
}

function mapMidiToBass ({ type, input }) {
  return 'keydown'
}

module.exports = Clap