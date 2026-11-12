import { Component, createRef } from 'react'
import { CATEGORIES } from '../data/categories'
import { MAX_AMOUNT, formatMoney, todayISO, validateExpense } from '../utils/expense'

const QUICK_AMOUNTS = [10000, 50000, 100000]

const emptyForm = () => ({ title: '', amount: '', category: '', date: todayISO() })

class ExpenseForm extends Component {
  state = { ...emptyForm(), errors: {}, submitted: false }

  titleRef = createRef()

  updateField = (name, value) => {
    this.setState((prev) => {
      const next = { ...prev, [name]: value }
      return { [name]: value, errors: prev.submitted ? validateExpense(next) : prev.errors }
    })
  }

  handleChange = (e) => {
    this.updateField(e.target.name, e.target.value)
  }

  handleAmountChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9)
    this.updateField('amount', digits)
  }

  addQuickAmount = (value) => {
    const next = Math.min(Number(this.state.amount || 0) + value, MAX_AMOUNT)
    this.updateField('amount', String(next))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { title, amount, category, date } = this.state
    const errors = validateExpense({ title, amount, category, date })

    if (Object.keys(errors).length > 0) {
      this.setState({ errors, submitted: true })
      const firstField = ['title', 'amount', 'category', 'date'].find((f) => errors[f])
      const el = e.target.elements[firstField]
      if (el) (el.length ? el[0] : el).focus()
      return
    }

    this.props.onAdd({ title: title.trim(), amount: Number(amount), category, date })
    this.setState({ ...emptyForm(), date, errors: {}, submitted: false })
    this.titleRef.current.focus()
  }

  render() {
    const { title, amount, category, date, errors } = this.state
    const amountText = amount ? Number(amount).toLocaleString('vi-VN') : ''

    return (
      <form className="slip" onSubmit={this.handleSubmit} noValidate>
        <div className="slip-head">
          <h2>Thêm khoản chi</h2>
        </div>

        <div className={errors.title ? 'field has-error' : 'field'}>
          <label htmlFor="title">Việc cần chi tiêu</label>
          <input
            id="title"
            name="title"
            ref={this.titleRef}
            value={title}
            onChange={this.handleChange}
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
              onChange={this.handleAmountChange}
              placeholder="0"
              autoComplete="off"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
            <span aria-hidden="true">đ</span>
          </div>
          <div className="quick-amounts">
            {QUICK_AMOUNTS.map((v) => (
              <button key={v} type="button" onClick={() => this.addQuickAmount(v)}>
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
                <input
                  type="radio"
                  name="category"
                  value={c.id}
                  checked={category === c.id}
                  onChange={this.handleChange}
                />
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
            onChange={this.handleChange}
            aria-invalid={!!errors.date}
          />
          {errors.date && <p className="field-error">{errors.date}</p>}
        </div>

        <button type="submit" className="btn-primary">
          Thêm vào sổ
        </button>
      </form>
    )
  }
}

export default ExpenseForm
