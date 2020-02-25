const React = require('react')
const { useState, useEffect } = React
const Tone = require('tone')

const EnvelopeVisualiser = require('./EnvelopeVisualiser')
const MIDIAccess = require('../utils/MIDIAccess')
const Chimes = require('../instruments/Chimes')
const Bass = require('../instruments/Bass')
const Kick = require('../instruments/Kick')
const HiHat = require('../instruments/HiHat')
const mapMIDIToTone = require('../utils/mapMIDIToTone')
const ControlPanel = require('./ControlPanel')

function Application (props) {
  const [attack, setAttack] = useState(props.attack)
  const [decay, setDecay] = useState(props.decay)
  const [sustain, setSustain] = useState(props.sustain)
  const [release, setRelease] = useState(props.release)
  const [volume, setVolume] = useState(props.volume)
  const [baseFrequency, setBaseFrequency] = useState(props.baseFrequency)
  const [voice, setVoice] = useState(props.voice)
  const [playState, setPlayState] = useState(props.playState)
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    // Chimes
    var voices = {
      chimes: new Chimes({ attack, decay, sustain, release, volume, baseFrequency }),
      bass: new Bass(),
      kick: new Kick(),
      hihat: new HiHat()
    }

    document.onkeydown = onKeyboardInput
    document.onkeyup = onKeyboardInput

    if (initialised) {
      let midi = new MIDIAccess({ onDeviceInput });
      midi.start().then(() => {
        console.log('STARTED!');
      }).catch(console.error);
    }

    const _ = null

    //Bass sequence 1
    // var seq = new Tone.Sequence(callback.bind(this), [
    //   ["F#2", _, "E2", _], ["D2", _, "C2", _], ["B1", _, "A1", _], ["G1", _, "G1", "A1"],
    //   ["F#2", _, "E2", _], ["D2", _, "C2", _], ["B1", _, "A1", _], ["G1", _, "G1", "A1"],
    //   ["F#2", _, "E2", _], ["D2", _, "C2", _], ["B1", _, "A1", _], ["G1", _, "G1", "A1"],
    //   ["F#2", _, "E2", _], ["D2", _, "C2", _], ["B1", _, "A1", _], ["G1", _, "G1", "A1"],
    // ]).start();

    // Bass sequence 2
    var seq = new Tone.Sequence(voices['bass'].handleSequenceEvent, [
      ["A1", _, _, _], ["A1", _, _, _], ["A1", _, _, _], ["A1", _, "B1", "C2"],
      [_, _, _, _], ["C2", _, _, _], ["C2", _, _, _], ["C2", _, "D2", "E2"],
      [_, _, _, _], ["E2", _, _, _], ["E2", _, _, _], ["E2", _, _, _],
      ["F#2", _, "E2", _], ["D2", _, "C2", _], ["B1", _, "A1", _], ["G1", _, "G1", "A1"]
    ]).start();

    //Bass sequence 3
    // var seq = new Tone.Sequence(callback.bind(this), [
    //   ["E2", _, "D3", _], ["E3", _, "E2", _], ["D3", _, "E2", "D3"], [_, "E2", "D3", "E3"],
    //   ["C2", _, "C3", _], ["C2", "C3" ,"C2", _], ["A2", "A1", _, "A2"], ["A2", "B2", "G2", _],
    //   ["E2", _, "D3", _], ["E3", _, _, _], ["D3", _, "E2", "D3"], [_, "E2", "D3", "E3"],
    //   ["C2", _, "C3", _], ["C2", "C3" ,"C2", _], ["A2", "A1", _, "A2"], ["A2", "B2", "G2", _]
    // ]).start();

    Tone.Transport.bpm.value = 122

    if (playState === 'started') {
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
    }

    function onKeyboardInput(e) {
      const type = e.type === 'keydown' ? 144 : 128
      switch (e.key) {
        case 'q':
          onDeviceInput({ type, input: 88, value: 0 })
          break
        case 'w':
          onDeviceInput({ type, input: 89, value: 0 })
          break
        case 'e':
          onDeviceInput({ type, input: 90, value: 0 })
          break
        case 'r':
          onDeviceInput({ type, input: 91, value: 0 })
          break
        case 't':
          onDeviceInput({ type, input: 92, value: 0 })
          break
        case 'y':
          onDeviceInput({ type, input: 93, value: 0 })
          break
        case 'u':
          onDeviceInput({ type, input: 94, value: 0 })
          break
        case 'i':
          onDeviceInput({ type, input: 95, value: 0 })
          break
        case 'o':
          onDeviceInput({ type, input: 96, value: 0 })
          break
        case 'a':
          voices['bass'].toggleSound(type, 'G1')
          break
        case 's':
          voices['bass'].toggleSound(type, 'A1')
          break
        case 'd':
          voices['bass'].toggleSound(type, 'B1')
          break
        case 'f':
          voices['bass'].toggleSound(type, 'C2')
          break
        case 'g':
          voices['bass'].toggleSound(type, 'D2')
          break
        case 'h':
          voices['bass'].toggleSound(type, 'E2')
          break
        case 'j':
          voices['bass'].toggleSound(type, 'F2')
          break
        case 'k':
          voices['bass'].toggleSound(type, 'F#2')
          break
      }
    }
    
    function onDeviceInput(event) {
      console.log('KF: voice: ', voice)
      voices[voice].handleMIDIEvent(event)
    }
  }, [voice, initialised, playState])

  const nextPlayState = playState === 'stopped' ? 'started': 'stopped'
  const nextPlayStateLabel = playState === 'stopped' ? 'start' : 'stop'

  return (
    <>
      {initialised && (
        <>
          <ControlPanel voice={voice} />
          <button onClick={() => setVoice('chimes')}>Chimes</button>
          <button onClick={() => setVoice('bass')}>Bass</button>
          <button onClick={() => setPlayState(nextPlayState)}>{nextPlayStateLabel}</button>
        </>
      )}
      {!initialised && (
        <>
          <p>Click button to initialise</p>
          <button onClick={() => setInitialised(true)}>Initialise!</button>
        </>
      )}
    </>
  )
}

Application.defaultProps = {
  attack: 6 / 100,
  decay: 20 / 200,
  sustain: 50 / 100,
  release: 1 / 1000,
  volume: 1,
  baseFrequency: 10000,
  voice: 'bass',
  playState: 'stopped'
}

module.exports = Application