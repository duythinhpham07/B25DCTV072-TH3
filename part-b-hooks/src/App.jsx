import { useEffect, useState } from 'react'
import CategoryStats from './components/CategoryStats'
import Clock from './components/Clock'
import ExpenseForm from './components/ExpenseForm'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import Receipt from './components/Receipt'
import SearchBox from './components/SearchBox'
import { CATEGORY_NAME } from './data/categories'
import useDebounce from './hooks/useDebounce'
import useFetch from './hooks/useFetch'
import { countByCategory, filterExpenses, formatMoney, normalizeText, sumAmount } from './utils/expense'

const API_URL = import.meta.env.VITE_API_URL

export default function App() {
  const { data: expenses, loading, error, reload, addItem, removeItem } = useFetch(API_URL)
  const [filter, setFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [showClock, setShowClock] = useState(true)
  const [lastAddedId, setLastAddedId] = useState(null)
  const keyword = useDebounce(searchText, 400)

  const visible = filterExpenses(expenses, filter, keyword)
  const total = sumAmount(expenses)
  const isFiltered = filter !== 'all' || normalizeText(keyword) !== ''

  useEffect(() => {
    if (loading) document.title = 'Đang tải… | Sổ chi tiêu'
    else if (error) document.title = 'Lỗi tải dữ liệu | Sổ chi tiêu'
    else document.title = `${formatMoney(total)} đã chi | Sổ chi tiêu`
  }, [total, loading, error])

  const resetFilters = () => {
    setFilter('all')
    setSearchText('')
  }

  const handleAdd = async (data) => {
    const created = await addItem(data)
    setLastAddedId(created.id)
    if (filterExpenses([created], filter, keyword).length === 0) resetFilters()
  }

  return (
    <div className="app">
      <Header showClock={showClock} onToggleClock={() => setShowClock((s) => !s)} />

      <main className="layout">
        <div className="area-clock">
          {showClock ? (
            <Clock />
          ) : (
            <section className="clock clock--off">
              <p>Đồng hồ đang ẩn, bộ đếm giây đã được dừng.</p>
              <button type="button" className="btn-ghost" onClick={() => setShowClock(true)}>
                Hiện lại
              </button>
            </section>
          )}
        </div>

        <div className="area-form">
          <ExpenseForm onAdd={handleAdd} />
        </div>

        <div className="area-sheet">
          <div className="toolbar">
            <FilterBar value={filter} counts={countByCategory(expenses)} onChange={setFilter} />
            <SearchBox value={searchText} pending={searchText !== keyword} onChange={setSearchText} />
          </div>
          <Receipt
            expenses={visible}
            total={sumAmount(visible)}
            grandTotal={total}
            isFiltered={isFiltered}
            filterName={filter === 'all' ? 'tất cả các loại' : CATEGORY_NAME[filter]}
            keyword={keyword.trim()}
            lastAddedId={lastAddedId}
            loading={loading}
            error={error}
            onRetry={reload}
            onDelete={removeItem}
            onReset={resetFilters}
          />
        </div>

        <div className="area-stats">
          <CategoryStats expenses={expenses} active={filter} onSelect={setFilter} />
        </div>
      </main>
    </div>
  )
}
