import { Component } from 'react'

const TICKS = Array.from({ length: 60 }, (_, i) => i)

class Clock extends Component {
  state = { now: new Date() }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ now: new Date() })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { now } = this.state
    const pad = (n) => String(n).padStart(2, '0')
    const seconds = now.getSeconds()
    const dateText = now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    return (
      <section className="clock" aria-label="Đồng hồ">
        <p className="clock-date">{dateText}</p>
        <p className="clock-time">
          <time dateTime={now.toISOString()}>
            {pad(now.getHours())}
            <span className="clock-colon">:</span>
            {pad(now.getMinutes())}
          </time>
          <span className="clock-sec">{pad(seconds)}</span>
        </p>
        <div className="clock-ticks" aria-hidden="true">
          {TICKS.map((i) => (
            <span key={i} className={i < seconds ? 'tick on' : i === seconds ? 'tick now' : 'tick'} />
          ))}
        </div>
      </section>
    )
  }
}

export default Clock
