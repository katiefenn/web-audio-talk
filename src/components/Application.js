const React = require('react')
const { useState, useEffect } = React
const Tone = require('tone')

const EnvelopeVisualiser = require('./EnvelopeVisualiser')
const MIDIAccess = require('../utils/MIDIAccess')
const Chimes = require('../instruments/Chimes')
const Bass = require('../instruments/Bass')
const Kick = require('../instruments/Kick')
const Clap = require('../instruments/Clap')
const HiHat = require('../instruments/HiHat')
const Metronome = require('../instruments/Metronome')
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
  const [voices] = useState({
    chimes: new Chimes({ attack, decay, sustain, release, volume, baseFrequency }),
    bass: new Bass(),
    kick: new Kick(),
    clap: new Clap(),
    hihat: new HiHat(),
    metronome: new Metronome()
  })
  const [midi, setMidi] = useState(null)
  const _ = null
  const [sequences, setSequences] = useState(null)
  const [bassSequence, setBassSequence] = useState('bass1')

  useEffect(() => {
    if (initialised) {
      console.log('Starting...')
      const midi = new MIDIAccess({ onDeviceInput })

      midi.start().then(() => {
        console.log('STARTED!');
      }).catch(console.error);

      setSequences({
        bass1: new Tone.Sequence(voices['bass'].handleSequenceEvent, [
          ["F#2:12n", _, "E2:12n", _], ["D2:12n", _, "C2:12n", _], ["B1:12n", _, "A1:12n", _], ["G1:12n", _, "G1:12n", "A1:12n"],
          ["F#2:12n", _, "E2:12n", _], ["D2:12n", _, "C2:12n", _], ["B1:12n", _, "A1:12n", _], ["G1:12n", _, "G1:12n", "A1:12n"],
          ["F#2:12n", _, "E2:12n", _], ["D2:12n", _, "C2:12n", _], ["B1:12n", _, "A1:12n", _], ["G1:12n", _, "G1:12n", "A112n"],
          ["F#2:12n", _, "E2:12n", _], ["D2:12n", _, "C2:12n", _], ["B1:12n", _, "A1:12n", _], ["G1:12n", _, "G1:12n", "A112n"],
        ]),
        bass2: new Tone.Sequence(voices['bass'].handleSequenceEvent, [
          ["A1:8n", _, _, _], ["A1:8n", _, _, _], ["A1:8n", _, _, _], ["A1:8n", _, "B1:8n", "C2:8n"],
          [_, _, _, _], ["C2:8n", _, _, _], ["C2:8n", _, _, _], ["C2:8n", _, "D2:8n", "E2:8n"],
          [_, _, _, _], ["E2:8n", _, _, _], ["E2:8n", _, _, _], ["E2:8n", _, _, _],
          ["F#2:12n", _, "E2:12n", _], ["D2:12n", _, "C2:12n", _], ["B1:12n", _, "A1:12n", _], ["G1:12n", _, "G1:12n", "A1:12n"]
        ]),
        bass3: new Tone.Sequence(voices['bass'].handleSequenceEvent, [
          ["E2:12n", _, "D3:12n", _], ["E3:12n", _, "E2:12n", _], ["D3:12n", _, "E2:12n", "D3:12n"], [_, "E2:12n", "D3:12n", "E3:12n"],
          ["C2:12n", _, "C3:12n", _], ["C2:12n", "C3:12n", "C2:12n", _], ["A2:12n", "A1:12n", _, "A2:12n"], ["A2:12n", "B2:12n", "G2:12n", _],
          ["E2:12n", _, "D3:12n", _], ["E3:12n", _, _, _], ["D3:12n", _, "E2:12n", "D3:12n"], [_, "E2:12n", "D3:12n", "E3:12n"],
          ["C2:12n", _, "C3:12n", _], ["C2:12n", "C3:12n" ,"C2:12n", _], ["A2:12n", "A1:12n", _, "A2:12n"], ["A2:12n", "B2:12n", "G2:12n", _]
        ]),
        chimes1: new Tone.Sequence(voices['chimes'].handleSequenceEvent, [
          [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
          ["D5", _, "C5", _], ["B4", _, "A4", _], ["G4", _, "A4", _], ["G4", _, "A4", "B4"],
          [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
          ["E5", _, "D5", _], ["C5", _, "B4", _], ["A4", _, "B4", _], ["A4", _, "B4", "E4"],
        ]),
        chimes2: new Tone.Sequence(voices['chimes'].handleSequenceEvent, [
          ["F5", _, "D5", _], ["C5", _, "C5", _], [_, _, "C5", _], [_, _, "C5", "F4"]
        ]),
        kick: new Tone.Sequence(voices['kick'].handleSequenceEvent, [
          "C1", "C1", "C1", "C1"
        ]),
        clap: new Tone.Sequence(voices['clap'].handleSequenceEvent, [
          _, "C2", _, "C2"
        ]),
        hihat: new Tone.Sequence(voices['hihat'].handleSequenceEvent, [
          [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1],
          [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1],
          [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1],
          [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1], [_, _, 1, 1]
        ]),
        metronome: new Tone.Sequence(voices['metronome'].handleSequenceEvent, [
          'C6', 'C5', 'C5', 'C5'
        ])
      })

      setMidi(midi)
    }

    document.onkeydown = onKeyboardInput
    document.onkeyup = onKeyboardInput

  }, [initialised])

  useEffect(() => {
    if (playState === 'started') {
      sequences.bass1.start()
      sequences.bass2.start()
      sequences.bass2.mute = true
      sequences.bass3.start()
      sequences.bass3.mute = true
      sequences.chimes1.start()
      //sequences.chimes2.start()
      sequences.kick.start()
      sequences.clap.start()
      //sequences.metronome.start()
      //sequences.hihat.start()
      Tone.Transport.bpm.value = 122
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
    }
  }, [playState])

  useEffect(() => {
    if (playState === 'started') {
      sequences[bassSequence].mute = false;
      ['bass1', 'bass2', 'bass3'].filter(seq => seq !== bassSequence).map(seq => sequences[seq].mute = true)
    }
  }, [bassSequence])

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
    if (event.type === 153) {
      switch (event.input) {
        case 50:
          setBassSequence('bass1')
          break
        case 45:
          setBassSequence('bass2')
          break
        case 51:
          setBassSequence('bass3')
          break
      }
    } else {
      voices[voice].handleMIDIEvent(event)
    }    
  }

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
          <button onClick={() => setBassSequence('bass1')}>Bass 1</button>
          <button onClick={() => setBassSequence('bass2')}>Bass 2</button>
          <button onClick={() => setBassSequence('bass3')}>Bass 3</button>
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