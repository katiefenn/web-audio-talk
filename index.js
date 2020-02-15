const React = require('react')
const ReactDOM = require('react-dom')
const ControlPanel = require('./src/components/ControlPanel')
const MIDIAccess = require('./src/utils/MIDIAccess')
const Chimes = require('./src/instruments/Chimes')
const Bass = require('./src/instruments/Bass')
const mapMIDIToTone = require('./src/utils/mapMIDIToTone')

// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
var started = false;
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
      case 'a':
        inst.toggleSound(type, mapMIDIToTone(72))
        break
      case 's':
        inst.toggleSound(type, mapMIDIToTone(74))
        break
      case 'd':
        inst.toggleSound(type, mapMIDIToTone(76))
        break
      case 'f':
        inst.toggleSound(type, mapMIDIToTone(77))
        break
      case 'g':
        inst.toggleSound(type, mapMIDIToTone(79))
        break
      case 'h':
        inst.toggleSound(type, mapMIDIToTone(81))
        break
      case 'j':
        inst.toggleSound(type, mapMIDIToTone(83))
        break
      // case 'k':
      //   inst.toggleSound(type, 84)
      //   break
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
  const opts = {
    attack: 6 / 100,
    decay: 20 / 100,
    sustain: 50 / 100,
    release: 1 / 1000,
    volume: 1,
    baseFrequency: 10000
  }
  const inst = new Chimes(opts);
  
  function onDeviceInput({ type, input, value }) {
    if (input > 35 && input < 97) inst.toggleSound(type, mapMIDIToTone(input));
    else if (input === 20) inst.handleVolume(value);
    else if (input === 22) inst.handleAttack(value);
    else if (input === 23) inst.handleDecay(value);
    else if (input === 24) inst.handleSustain(value);
    else if (input === 25) inst.handleRelease(value);
    else if (input === 26) inst.handleBaseFrequency(value * 100);
    else if (input === 27) inst.handleFilter(value);
    else console.log('onDeviceInput!', type, input, value);
  }  
});

const controlPanel = ReactDOM.render(<ControlPanel />, document.getElementById('render'))


