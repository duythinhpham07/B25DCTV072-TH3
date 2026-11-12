import useClock from '../hooks/useClock'

const TICKS = Array.from({ length: 60 }, (_, i) => i)
const pad = (n) => String(n).padStart(2, '0')

export default function Clock() {
  const now = useClock()
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
