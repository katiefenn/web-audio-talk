const React = require('react')
const { useState, useEffect } = React

function ControlPanel () {
  const [attack, setAttack] = useState(null)
  const [decay, setDecay] = useState(null)
  const [sustain, setSustain] = useState(null)
  const [release, setRelease] = useState(null)
  const [volume, setVolume] = useState(null)
  const [baseFrequency, setBaseFrequency] = useState(null)

  useEffect(() => {
    
  }, [])

  return (
    <>
      <h1>Web Audio Instrument Control Panel</h1>
      {[attack, decay, sustain, release, volume, baseFrequency].some(i => !!i) && (
        <pre>
          Hello
        </pre>
      )}
    </>
  )
}

module.exports = ControlPanel