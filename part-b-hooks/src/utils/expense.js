import { CATEGORIES } from '../data/categories'

const moneyFormat = new Intl.NumberFormat('vi-VN')

export function formatMoney(n) {
  return moneyFormat.format(n) + 'đ'
}

export function toISODate(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function dayLabel(iso) {
  const d = new Date(iso + 'T00:00:00')
  const short = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (iso === todayISO()) return `Hôm nay, ${short}`
  if (iso === toISODate(yesterday)) return `Hôm qua, ${short}`

  const weekday = d.toLocaleDateString('vi-VN', { weekday: 'long' })
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${short}`
}

export function normalizeText(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

export function filterExpenses(list, category, keyword) {
  const key = normalizeText(keyword)
  return list.filter((e) => {
    if (category !== 'all' && e.category !== category) return false
    if (key && !normalizeText(e.title).includes(key)) return false
    return true
  })
}

export function sumAmount(list) {
  return list.reduce((total, e) => total + Number(e.amount), 0)
}

export function groupByDate(list) {
  const sorted = [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return Number(b.id) - Number(a.id)
  })
  const groups = []
  for (const e of sorted) {
    const last = groups[groups.length - 1]
    if (last && last.date === e.date) last.items.push(e)
    else groups.push({ date: e.date, items: [e] })
  }
  return groups
}

export function statsByCategory(list) {
  return CATEGORIES.map((c) => {
    const items = list.filter((e) => e.category === c.id)
    return { ...c, count: items.length, total: sumAmount(items) }
  })
}

export function countByCategory(list) {
  const counts = { all: list.length }
  for (const c of CATEGORIES) counts[c.id] = 0
  for (const e of list) counts[e.category] = (counts[e.category] || 0) + 1
  return counts
}

export const MIN_AMOUNT = 1000
export const MAX_AMOUNT = 100000000

export function validateExpense({ title, amount, category, date }) {
  const errors = {}
  const text = title.trim()
  const money = Number(amount)

  if (text.length < 2) errors.title = 'Nhập nội dung, ít nhất 2 ký tự.'
  else if (text.length > 60) errors.title = 'Nội dung tối đa 60 ký tự.'

  if (!amount) errors.amount = 'Nhập số tiền đã chi.'
  else if (money < MIN_AMOUNT) errors.amount = `Số tiền tối thiểu ${formatMoney(MIN_AMOUNT)}.`
  else if (money > MAX_AMOUNT) errors.amount = `Số tiền tối đa ${formatMoney(MAX_AMOUNT)}.`

  if (!category) errors.category = 'Chọn một loại chi.'

  if (!date) errors.date = 'Chọn ngày chi.'
  else if (date > todayISO()) errors.date = 'Ngày chi không được ở tương lai.'

  return errors
}
