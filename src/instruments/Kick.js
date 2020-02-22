const Tone = require('tone')

class Kick {
  constructor() {
    // this.synth = new Tone.PolySynth(4, Tone.Synth, {
    //   volume: 1,
    //   oscillator : {
    //     type : "sawtooth"
    //   },
    //   envelope : {
    //     attack : 0.00001 ,
    //     decay : 0.1 ,
    //     sustain : 0.3 ,
    //     release : 0.00001
    //   }
    // })
    // this.synth2 = new Tone.PolySynth(4, Tone.Synth, {
    //   volume: 1,    
    //   oscillator : {
    //     type : "sawtooth"
    //   },
    //   envelope : {
    //     attack : 0.00001 ,
    //     decay : 0.1 ,
    //     sustain : 0.3 ,
    //     release : 0.00001
    //   }
    // }).set("detune", 1200)

    // this.filter = new Tone.Filter();
    // this.filter2 = new Tone.Filter();
    // this.volume = new Tone.Gain();
    // this.volume2 = new Tone.Gain();

    // this.synth.connect(this.filter);
    // this.synth2.connect(this.filter2);
    // this.filter.connect(this.volume);
    // this.filter2.connect(this.volume2);
    // this.volume.toMaster();
    // this.volume2.toMaster();
    
    // this.filter.frequency.value = 2 / 127 * 10800; // 200 - 15000
    // this.filter2.frequency.value = 2 / 127 * 10800; // 200 - 15000
    // this.volume.gain.value = 127 / 127; // 0-0.8
    // this.volume2.gain.value = 6 / 127; // 0-0.8

    this.synth = new Tone.MembraneSynth({
      pitchDecay: 0.2,
      octaves: 2.0,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.01,
        release: 0.1,
        attackCurve: 'linear'
      }
    }).toMaster()

    function callback(time, note){
      //the notes given as the second element in the array
      //will be passed in as the second argument
      this.synth.triggerAttackRelease(note, "8n", time);
    }

    const _ = null

    //Bass sequence 1
    var seq = new Tone.Sequence(callback.bind(this), [
      ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _],
      ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _],
      ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _],
      ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _], ["C1", _, _, _]
    ]).start();
  }

  handleMIDIEvent (event) {
    this.synth.triggerAttackRelease('C1', '8n')
  }
}

function mapMidiToBass ({ type, input }) {
  return 'keydown'
}

module.exports = Kick