import { formatMoney, statsByCategory, sumAmount } from '../utils/expense'

export default function CategoryStats({ expenses, active, onSelect }) {
  const stats = statsByCategory(expenses)
  const total = sumAmount(expenses)
  const max = Math.max(...stats.map((s) => s.total), 1)

  return (
    <section className="stats" aria-labelledby="stats-title">
      <div className="stats-head">
        <h2 id="stats-title">Chi theo loại</h2>
        <p>Bấm vào một loại để lọc sổ.</p>
      </div>
      <ul className="stats-list">
        {stats.map((s) => {
          const percent = total ? Math.round((s.total / total) * 100) : 0
          return (
            <li key={s.id}>
              <button
                type="button"
                className={`stat cat-${s.id}`}
                aria-pressed={active === s.id}
                onClick={() => onSelect(active === s.id ? 'all' : s.id)}
              >
                <span className="stat-name">
                  {s.name}
                  <small>{s.count} khoản</small>
                </span>
                <span className="stat-money">
                  {formatMoney(s.total)}
                  <small>{percent}%</small>
                </span>
                <span className="stat-bar" aria-hidden="true">
                  <span style={{ width: `${(s.total / max) * 100}%` }} />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
