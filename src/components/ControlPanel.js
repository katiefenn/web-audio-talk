const React = require('react')
const { useState, useEffect } = React

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
            inst.toggleSound(type, mapMIDIToTone(62+24))
            break
          case 'w':
            inst.toggleSound(type, mapMIDIToTone(64+24))
            break
          case 'e':
            inst.toggleSound(type, mapMIDIToTone(65+24))
            break
          case 'r':
            inst.toggleSound(type, mapMIDIToTone(67+24))
            break
          case 't':
            inst.toggleSound(type, mapMIDIToTone(69+24))
            break
          case 'y':
            inst.toggleSound(type, mapMIDIToTone(71+24))
            break
          case 'u':
            inst.toggleSound(type, mapMIDIToTone(72+24))
            break
          case 'i':
            inst.toggleSound(type, mapMIDIToTone(74+24))
            break
          case 'o':
            inst.toggleSound(type, mapMIDIToTone(76+24))
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
      const inst = new Chimes({ attack, decay, sustain, release, volume, baseFrequency });
      
      function onDeviceInput({ type, input, value }) {
        switch (input) {
          case 20:
            inst.handleVolume(value)
            setVolume(value)
            break
          case 22:
            inst.handleAttack(value)
            setAttack(value)
            break
          case 23:
            inst.handleDecay(value)
            setDecay(value)
            break
          case 61:
            inst.handleSustain(value)
            setSustain(value)
            break
          case 24:
            inst.handleRelease(value)
            setRelease(value)
            break
          case 26:
            inst.handleBaseFrequency(value * 100)
            setBaseFrequency(value * 100)
          case 27:
            inst.handleFilter(value)
            break
          default:
            if (input > 35 && input < 97) inst.toggleSound(type, mapMIDIToTone(input + 24))
            console.log('onDeviceInput!', type, input, value)
        }
      }  
    });
  }, [])

  return (
    <>
      <h1>Web Audio Instrument Control Panel</h1>
      {[attack, decay, sustain, release, volume, baseFrequency].some(i => !!i) && (
        <pre>
          {'{'}
            attack: {attack},
            decay: {decay},
            sustain: {sustain},
            release: {release},
            volume: {volume},
            baseFrequency: {baseFrequency}
          {'}'}
        </pre>
      )}
    </>
  )
}

module.exports = ControlPanel