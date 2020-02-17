const React = require('react')
const { useState, useEffect } = React

const EnvelopeVisualiser = require('./EnvelopeVisualiser')
const MIDIAccess = require('../utils/MIDIAccess')
const Chimes = require('../instruments/Chimes')
const Bass = require('../instruments/Bass')
const mapMIDIToTone = require('../utils/mapMIDIToTone')

function ControlPanel () {
  const [attack, setAttack] = useState(6 / 100)
  const [decay, setDecay] = useState(20 / 100)
  const [sustain, setSustain] = useState(50 / 100)
  const [release, setRelease] = useState(1 / 1000)
  const [volume, setVolume] = useState(1)
  const [baseFrequency, setBaseFrequency] = useState(10000)

  useEffect(() => {
    let started = false
    document.documentElement.addEventListener('mousedown', () => {
      if (started) return;
      started = true;
      const midi = new MIDIAccess({ onDeviceInput });
      midi.start().then(() => {
        console.log('STARTED!');
      }).catch(console.error);
    
      document.onkeydown = onKeyboardInput
      document.onkeyup = onKeyboardInput
      
      function onKeyboardInput(e) {
        const type = e.type === 'keydown' ? 144 : 123
        switch (e.key) {
          case 'q':
            chimes.toggleSound(type, mapMIDIToTone(62+24))
            break
          case 'w':
            chimes.toggleSound(type, mapMIDIToTone(64+24))
            break
          case 'e':
            chimes.toggleSound(type, mapMIDIToTone(65+24))
            break
          case 'r':
            chimes.toggleSound(type, mapMIDIToTone(67+24))
            break
          case 't':
            chimes.toggleSound(type, mapMIDIToTone(69+24))
            break
          case 'y':
            chimes.toggleSound(type, mapMIDIToTone(71+24))
            break
          case 'u':
            chimes.toggleSound(type, mapMIDIToTone(72+24))
            break
          case 'i':
            chimes.toggleSound(type, mapMIDIToTone(74+24))
            break
          case 'o':
            chimes.toggleSound(type, mapMIDIToTone(76+24))
            break
          case 'a':
            bass.toggleSound(type, 'G1')
            break
          case 's':
            bass.toggleSound(type, 'A1')
            break
          case 'd':
            bass.toggleSound(type, 'B1')
            break
          case 'f':
            bass.toggleSound(type, 'C2')
            break
          case 'g':
            bass.toggleSound(type, 'D2')
            break
          case 'h':
            bass.toggleSound(type, 'E2')
            break
          case 'j':
            bass.toggleSound(type, 'F2')
            break
          case 'k':
            bass.toggleSound(type, 'F#2')
            break
        }
      }
      
      // Baseline
      // const inst = new Baseline();
      // function onDeviceInput({ type, input, value }) {
      //   if (input > 35 && input < 97) inst.toggleSound(type, input);
      //   else if (input === 22) inst.handleVolume(value);
      //   else if (input === 23) inst.handleVolume2(value);
      //   else if (input === 26) inst.handleFilter(value);
      //   else if (input === 27) inst.handleFilter2(value);
      //   console.log('onDeviceInput!', type, input, value);
      // }
    
      // Chimes
      const chimes = new Chimes({ attack, decay, sustain, release, volume, baseFrequency });
      const bass = new Bass()
      
      function onDeviceInput({ type, input, value }) {
        switch (input) {
          case 20:
            inst.handleVolume(value)
            setVolume(value)
            break
          case 22:
            chimes.handleAttack(value / 1000)
            setAttack(value / 1000)
            break
          case 23:
            chimes.handleDecay(value / 1000)
            setDecay(value / 1000)
            break
          case 61:
            chimes.handleSustain(value / 127)
            setSustain(value / 127)
            break
          case 24:
            chimes.handleRelease(value / 100)
            setRelease(value / 100)
            break
          case 26:
            chimes.handleBaseFrequency(value * 100)
            setBaseFrequency(value * 100)
          case 27:
            chimes.handleFilter(value)
            break
          default:
            if (input > 35 && input < 97) chimes.toggleSound(type, mapMIDIToTone(input + 24))
            console.log('onDeviceInput!', type, input, value)
        }
      }  
    });
  }, [])

  return (
    <>
      <h1>Web Audio experiment</h1>
      <p>Recreating famous dance tracks with WebAudio API!</p>
      <p>First: click the page. This is needed to initialise the API.</p>
      <p>Try the baseline: S, S, S, S, D, F, F, F, F, G, H, H, H, H, K, H, G, F, D, S, A, S</p>
      <p>Try the chimes: Q, W, I, U, Y, T, R, T, R, T, Y</p>
    </>
  )
}

module.exports = ControlPanel