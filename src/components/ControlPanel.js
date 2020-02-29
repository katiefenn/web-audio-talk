const React = require('react')

function ControlPanel (props) {
  return (
    <>
      <h1>Web Audio experiment</h1>
      <p>Recreating famous dance tracks with WebAudio API!</p>
      <p>First: click the page. This is needed to initialise the API.</p>
      <p>Try the base voice: W, W, W, W, E, R, R, R, R, T, Y, Y, Y, Y, I, Y, T, R, E, W, Q, W</p>
      <p>Try the chimes voice: Q, W, I, U, Y, T, R, T, R, T, Y</p>
      <dl>
        <dt>Voice:</dt><dd>{props.voice}</dd>
      </dl>
    </>
  )
}

module.exports = ControlPanel