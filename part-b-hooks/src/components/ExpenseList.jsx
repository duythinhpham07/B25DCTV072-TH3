import { dayLabel, groupByDate } from '../utils/expense'
import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, lastAddedId, onDelete, emptyText }) {
  if (expenses.length === 0) {
    return <p className="receipt-empty">{emptyText}</p>
  }

  return (
    <div className="receipt-groups">
      {groupByDate(expenses).map((group) => (
        <section key={group.date} className="day-group">
          <h3 className="day-label">{dayLabel(group.date)}</h3>
          <ul className="lines">
            {group.items.map((e) => (
              <ExpenseItem key={e.id} expense={e} isNew={e.id === lastAddedId} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
