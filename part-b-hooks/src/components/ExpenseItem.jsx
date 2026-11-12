import { useEffect, useRef, useState } from 'react'
import { CATEGORY_NAME } from '../data/categories'
import { formatMoney } from '../utils/expense'
import { closeIcon } from './icons'

export default function ExpenseItem({ expense, isNew, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const keepRef = useRef(null)

  useEffect(() => {
    if (confirming) keepRef.current?.focus()
  }, [confirming])

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      await onDelete(expense.id)
    } catch (err) {
      setError(`Chưa xóa được: ${err.message}`)
      setDeleting(false)
    }
  }

  const className = ['line', `cat-${expense.category}`, isNew && 'is-new', confirming && 'is-confirming', deleting && 'is-removing']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className}>
      {confirming ? (
        <div className="line-confirm" onKeyDown={(e) => e.key === 'Escape' && setConfirming(false)}>
          <p>
            {deleting ? 'Đang xóa ' : 'Xóa '}
            <strong>{expense.title}</strong> ({formatMoney(expense.amount)}){deleting ? '…' : '?'}
            {error && <span className="line-error">{error}</span>}
          </p>
          <div className="line-confirm-actions">
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
              {error ? 'Thử lại' : 'Xóa'}
            </button>
            <button type="button" className="btn-ghost" ref={keepRef} onClick={() => setConfirming(false)} disabled={deleting}>
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
            <span className="line-cat">{CATEGORY_NAME[expense.category] || 'Khác'}</span>
          </div>
          <button
            type="button"
            className="line-delete"
            onClick={() => setConfirming(true)}
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
