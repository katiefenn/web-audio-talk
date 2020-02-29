const React = require('react')
const { useState, useEffect } = React
const Tone = require('tone')

const EnvelopeVisualiser = require('./EnvelopeVisualiser')
const MIDIAccess = require('../utils/MIDIAccess')
const Chimes = require('../instruments/Chimes')
const Vocoder = require('../instruments/Vocoder')
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
  const [voice, setVoice] = useState('vocoder')
  const [playState, setPlayState] = useState(props.playState)
  const [initialised, setInitialised] = useState(false)
  const [voices] = useState({
    chimes: new Chimes({ attack, decay, sustain, release, volume, baseFrequency }),
    vocoder: new Vocoder(),
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
  const [chimesSequence, setChimesSequence] = useState('chimes1')

  useEffect(() => {
    if (initialised) {
      console.log('Starting...')
      const newMidi = new MIDIAccess({ onDeviceInput })

      newMidi.start().then(() => {
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
        chimes2: new Tone.Sequence(voices['chimes'].handleSequenceEvent, [
          [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
          ["D5", _, "C5", _], ["B4", _, "A4", _], ["G4", _, "A4", _], ["G4", _, "A4", "B4"],
          [_, _, _, _], [_, _, _, _], [_, _, _, _], [_, _, "D4", "E4"],
          ["E5", _, "D5", _], ["C5", _, "B4", _], ["A4", _, "B4", _], ["A4", _, "B4", "E4"],
        ]),
        chimes1: new Tone.Sequence(voices['chimes'].handleSequenceEvent, [
          ["E5", _, "D5", _], ["B4", _, "A4", _], [_, _, "A4", _], [_, _, "A4", "G4"]
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

      function onKeyboardInput(e) {
        switch (event.key) {
          case 'a':
            setBassSequence('bass1')
            break
          case 's':
            setBassSequence('bass2')
            break
          case 'd':
            setBassSequence('bass3')
            break
          case 'z':
            setChimesSequence('chimes1')
            break
          case 'x':
            setChimesSequence('chimes2')
            break
          default:
            voices[voice].handleQwertyEvent(e)
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
            case 36:
              setChimesSequence('chimes1')
              break
            case 38:
              setChimesSequence('chimes2')
              break
          }
        } else {
          console.log(voice)
          voices[voice].handleMIDIEvent(event)
        }    
      }

      document.onkeydown = onKeyboardInput
      document.onkeyup = onKeyboardInput

      setMidi(newMidi)

      return () => {
        newMidi.onDeviceInput = null
      }
    }
  }, [initialised, voice])

  useEffect(() => {
    if (playState === 'started') {
      sequences.bass1.start()
      sequences.bass2.start()
      sequences.bass2.mute = true
      sequences.bass3.start()
      sequences.bass3.mute = true
      sequences.chimes1.start()
      sequences.chimes2.start()
      sequences.chimes2.mute = true
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

  useEffect(() => {
    if (playState === 'started') {
      sequences[chimesSequence].mute = false;
      ['chimes1', 'chimes2'].filter(seq => seq !== chimesSequence).map(seq => sequences[seq].mute = true)
    }
  }, [chimesSequence])

  const nextPlayState = playState === 'stopped' ? 'started': 'stopped'
  const nextPlayStateLabel = playState === 'stopped' ? 'start' : 'stop'

  return (
    <>
      {initialised && (
        <>
          <ControlPanel voice={voice} />
          <h2>Control voice</h2>
          <button onClick={() => setVoice('chimes')}>Chimes</button>
          <button onClick={() => setVoice('bass')}>Bass</button>
          <button onClick={() => setVoice('vocoder')}>Vocoder</button>
          <h2>Control sequencer</h2>
          <button onClick={() => setPlayState(nextPlayState)}>{nextPlayStateLabel}</button>
          <button onClick={() => setBassSequence('bass1')}>Bass 1 (A)</button>
          <button onClick={() => setBassSequence('bass2')}>Bass 2 (S)</button>
          <button onClick={() => setBassSequence('bass3')}>Bass 3 (D)</button>
          <button onClick={() => setChimesSequence('chimes1')}>Chimes 1 (Z)</button>
          <button onClick={() => setChimesSequence('chimes1')}>Chimes 1 (X)</button>
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