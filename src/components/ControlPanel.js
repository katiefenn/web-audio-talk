const React = require('react')

class ControlPanel extends React.PureComponent {
  render () {
    const {
      attack,
      decay,
      sustain,
      release,
      volume,
      baseFrequency
    } = this.props

    return (
      <>
        <h1>Web Audio Instrument Control Panel</h1>
        <pre>
          {"{"}
          {(Object.keys(this.props).map(key => <div>{"  "}{key}: {this.props[key]},</div>))}
          {"}"}
        </pre>
      </>
    )
  }
}

module.exports = ControlPanel