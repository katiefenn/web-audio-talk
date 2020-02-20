const React = require('react')

function ControlPanel (props) {
  return (
    <>
      <h1>Web Audio experiment</h1>
      <p>Recreating famous dance tracks with WebAudio API!</p>
      <p>First: click the page. This is needed to initialise the API.</p>
      <p>Try the baseline: S, S, S, S, D, F, F, F, F, G, H, H, H, H, K, H, G, F, D, S, A, S</p>
      <p>Try the chimes: Q, W, I, U, Y, T, R, T, R, T, Y</p>
      <dl>
        <dt>Voice:</dt><dd>{props.voice}</dd>
      </dl>
    </>
  )
}

module.exports = ControlPanel