import { Component, createRef } from 'react'
import { CATEGORY_NAME } from '../data/categories'
import { formatMoney } from '../utils/expense'
import { closeIcon } from './icons'

class ExpenseItem extends Component {
  state = { confirming: false }

  keepRef = createRef()
  deleteRef = createRef()

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.confirming && this.state.confirming) this.keepRef.current?.focus()
    if (prevState.confirming && !this.state.confirming) this.deleteRef.current?.focus()
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape') this.setState({ confirming: false })
  }

  render() {
    const { expense, isNew, onDelete } = this.props
    const { confirming } = this.state
    const className = ['line', `cat-${expense.category}`, isNew && 'is-new', confirming && 'is-confirming']
      .filter(Boolean)
      .join(' ')

    return (
      <li className={className}>
        {confirming ? (
          <div className="line-confirm" onKeyDown={this.handleKeyDown}>
            <p>
              Xóa <strong>{expense.title}</strong> ({formatMoney(expense.amount)})?
            </p>
            <div className="line-confirm-actions">
              <button type="button" className="btn-danger" onClick={() => onDelete(expense.id)}>
                Xóa
              </button>
              <button type="button" className="btn-ghost" ref={this.keepRef} onClick={() => this.setState({ confirming: false })}>
                Giữ lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="line-mark" aria-hidden="true" />
            <div className="line-body">
              <div className="line-row">
                <span className="line-title">{expense.title}</span>
                <span className="line-leader" aria-hidden="true" />
                <span className="line-amount">{formatMoney(expense.amount)}</span>
              </div>
              <span className="line-cat">{CATEGORY_NAME[expense.category]}</span>
            </div>
            <button
              type="button"
              className="line-delete"
              ref={this.deleteRef}
              onClick={() => this.setState({ confirming: true })}
              aria-label={`Xóa khoản ${expense.title}`}
              title="Xóa khoản này"
            >
              {closeIcon}
            </button>
          </>
        )}
      </li>
    )
  }
}

export default ExpenseItem
