import { useRef, useState } from 'react'
import { CATEGORIES } from '../data/categories'
import { MAX_AMOUNT, formatMoney, todayISO, validateExpense } from '../utils/expense'

const QUICK_AMOUNTS = [10000, 50000, 100000]

const emptyForm = () => ({ title: '', amount: '', category: '', date: todayISO() })

export default function ExpenseForm({ onAdd }) {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const titleRef = useRef(null)

  const updateField = (name, value) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (submitted) setErrors(validateExpense(next))
  }

  const handleChange = (e) => updateField(e.target.name, e.target.value)

  const handleAmountChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9)
    updateField('amount', digits)
  }

  const addQuickAmount = (value) => {
    const next = Math.min(Number(values.amount || 0) + value, MAX_AMOUNT)
    updateField('amount', String(next))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validateExpense(values)
    setErrors(found)
    setSubmitted(true)
    setServerError('')

    if (Object.keys(found).length > 0) {
      const firstField = ['title', 'amount', 'category', 'date'].find((f) => found[f])
      const el = e.target.elements[firstField]
      if (el) (el.length ? el[0] : el).focus()
      return
    }

    setSaving(true)
    try {
      await onAdd({
        title: values.title.trim(),
        amount: Number(values.amount),
        category: values.category,
        date: values.date,
      })
      setValues({ ...emptyForm(), date: values.date })
      setSubmitted(false)
      titleRef.current.focus()
    } catch (err) {
      setServerError(`Chưa lưu được: ${err.message}. Thử lại sau giây lát.`)
    } finally {
      setSaving(false)
    }
  }

  const { title, amount, category, date } = values
  const amountText = amount ? Number(amount).toLocaleString('vi-VN') : ''

  return (
    <form className="slip" onSubmit={handleSubmit} noValidate>
      <div className="slip-head">
        <h2>Ghi khoản chi</h2>
        <p>Điền đủ bốn mục rồi bấm thêm vào sổ.</p>
      </div>

      <div className={errors.title ? 'field has-error' : 'field'}>
        <label htmlFor="title">Chi cho việc gì</label>
        <input
          id="title"
          name="title"
          ref={titleRef}
          value={title}
          onChange={handleChange}
          placeholder="Ví dụ: Cơm trưa căng tin"
          maxLength={80}
          autoComplete="off"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <p className="field-error" id="title-error">{errors.title}</p>}
      </div>

      <div className={errors.amount ? 'field has-error' : 'field'}>
        <label htmlFor="amount">Số tiền</label>
        <div className="money-input">
          <input
            id="amount"
            name="amount"
            inputMode="numeric"
            value={amountText}
            onChange={handleAmountChange}
            placeholder="0"
            autoComplete="off"
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          <span aria-hidden="true">đ</span>
        </div>
        <div className="quick-amounts">
          {QUICK_AMOUNTS.map((v) => (
            <button key={v} type="button" onClick={() => addQuickAmount(v)}>
              +{formatMoney(v)}
            </button>
          ))}
        </div>
        {errors.amount && <p className="field-error" id="amount-error">{errors.amount}</p>}
      </div>

      <fieldset className={errors.category ? 'field has-error' : 'field'}>
        <legend>Loại</legend>
        <div className="cat-picker">
          {CATEGORIES.map((c) => (
            <label key={c.id} className={`cat-option cat-${c.id}`}>
              <input type="radio" name="category" value={c.id} checked={category === c.id} onChange={handleChange} />
              <span className="cat-swatch" aria-hidden="true" />
              {c.name}
            </label>
          ))}
        </div>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </fieldset>

      <div className={errors.date ? 'field has-error' : 'field'}>
        <label htmlFor="date">Ngày chi</label>
        <input
          id="date"
          name="date"
          type="date"
          value={date}
          max={todayISO()}
          onChange={handleChange}
          aria-invalid={!!errors.date}
        />
        {errors.date && <p className="field-error">{errors.date}</p>}
      </div>

      {serverError && (
        <p className="form-alert" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Đang lưu vào sổ…' : 'Thêm vào sổ'}
      </button>
    </form>
  )
}
