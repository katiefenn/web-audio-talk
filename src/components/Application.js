const React = require('react')
const { useState, useEffect } = React

const EnvelopeVisualiser = require('./EnvelopeVisualiser')
const MIDIAccess = require('../utils/MIDIAccess')
const Chimes = require('../instruments/Chimes')
const Bass = require('../instruments/Bass')
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

  useEffect(() => {
    let started = false
    document.documentElement.addEventListener('mousedown', () => {
      if (started) return;
      started = true;
      let midi = new MIDIAccess({ onDeviceInput });
      midi.start().then(() => {
        console.log('STARTED!');
      }).catch(console.error);
    
      document.onkeydown = onKeyboardInput
      document.onkeyup = onKeyboardInput
      
      function onKeyboardInput(e) {
        const type = e.type === 'keydown' ? 144 : 123
        switch (e.key) {
          case 'q':
            voices['chimes'].toggleSound(type, mapMIDIToTone(62+24))
            break
          case 'w':
            voices['chimes'].toggleSound(type, mapMIDIToTone(64+24))
            break
          case 'e':
            voices['chimes'].toggleSound(type, mapMIDIToTone(65+24))
            break
          case 'r':
            voices['chimes'].toggleSound(type, mapMIDIToTone(67+24))
            break
          case 't':
            voices['chimes'].toggleSound(type, mapMIDIToTone(69+24))
            break
          case 'y':
            voices['chimes'].toggleSound(type, mapMIDIToTone(71+24))
            break
          case 'u':
            voices['chimes'].toggleSound(type, mapMIDIToTone(72+24))
            break
          case 'i':
            voices['chimes'].toggleSound(type, mapMIDIToTone(74+24))
            break
          case 'o':
            voices['chimes'].toggleSound(type, mapMIDIToTone(76+24))
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
    
      // Chimes
      const voices = {
        chimes: new Chimes({ attack, decay, sustain, release, volume, baseFrequency }),
        bass: new Bass()
      }
      
      function onDeviceInput(event) {
        voices[voice].handleMIDIEvent(event)
      }

      return () => {
        midi.stop().then(() => {
          console.log('Stopped!')
          midi = undefined
        })
      }
    });

  }, [voice])

  return (
    <ControlPanel voice={voice} />
  )
}

Application.defaultProps = {
  attack: 6 / 100,
  decay: 20 / 200,
  sustain: 50 / 100,
  release: 1 / 1000,
  volume: 1,
  baseFrequency: 10000,
  voice: 'bass'
}

module.exports = Application