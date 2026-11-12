import { Component } from 'react'
import CategoryStats from './components/CategoryStats'
import Clock from './components/Clock'
import ExpenseForm from './components/ExpenseForm'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import Receipt from './components/Receipt'
import SearchBox from './components/SearchBox'
import { CATEGORY_NAME } from './data/categories'
import sampleExpenses from './data/sampleExpenses'
import { countByCategory, filterExpenses, formatMoney, normalizeText, sumAmount } from './utils/expense'

const SEARCH_DELAY = 400

function getSavedTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

class App extends Component {
  state = {
    expenses: sampleExpenses,
    filter: 'all',
    searchText: '',
    keyword: '',
    theme: getSavedTheme(),
    showClock: true,
    lastAddedId: null,
  }

  componentDidMount() {
    this.updateTitle()
    document.documentElement.dataset.theme = this.state.theme
  }

  componentDidUpdate(prevProps, prevState) {
    if (sumAmount(prevState.expenses) !== sumAmount(this.state.expenses)) {
      this.updateTitle()
    }
    if (prevState.theme !== this.state.theme) {
      document.documentElement.dataset.theme = this.state.theme
      localStorage.setItem('theme', this.state.theme)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimer)
  }

  updateTitle() {
    document.title = `${formatMoney(sumAmount(this.state.expenses))} đã chi | Sổ chi tiêu`
  }

  handleAdd = (data) => {
    const expense = { id: String(Date.now()), ...data }
    this.setState((prev) => {
      const visible = filterExpenses([expense], prev.filter, prev.keyword).length > 0
      return {
        expenses: [expense, ...prev.expenses],
        lastAddedId: expense.id,
        ...(visible ? {} : { filter: 'all', searchText: '', keyword: '' }),
      }
    })
  }

  handleDelete = (id) => {
    this.setState((prev) => ({ expenses: prev.expenses.filter((e) => e.id !== id) }))
  }

  handleSearch = (value) => {
    this.setState({ searchText: value })
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.setState({ keyword: value })
    }, SEARCH_DELAY)
  }

  resetFilters = () => {
    clearTimeout(this.searchTimer)
    this.setState({ filter: 'all', searchText: '', keyword: '' })
  }

  render() {
    const { expenses, filter, searchText, keyword, theme, showClock, lastAddedId } = this.state
    const visible = filterExpenses(expenses, filter, keyword)
    const isFiltered = filter !== 'all' || normalizeText(keyword) !== ''

    return (
      <div className="app">
        <Header
          theme={theme}
          showClock={showClock}
          onToggleTheme={() => this.setState((p) => ({ theme: p.theme === 'dark' ? 'light' : 'dark' }))}
          onToggleClock={() => this.setState((p) => ({ showClock: !p.showClock }))}
        />

        <main className="layout">
          <div className="area-clock">
            {showClock ? (
              <Clock />
            ) : (
              <section className="clock clock--off">
                <p>Đồng hồ đang ẩn, bộ đếm giây đã được dừng.</p>
                <button type="button" className="btn-ghost" onClick={() => this.setState({ showClock: true })}>
                  Hiện lại
                </button>
              </section>
            )}
          </div>

          <div className="area-form">
            <ExpenseForm onAdd={this.handleAdd} />
          </div>

          <div className="area-sheet">
            <div className="toolbar">
              <FilterBar value={filter} counts={countByCategory(expenses)} onChange={(id) => this.setState({ filter: id })} />
              <SearchBox value={searchText} pending={searchText !== keyword} onChange={this.handleSearch} />
            </div>
            <Receipt
              expenses={visible}
              total={sumAmount(visible)}
              grandTotal={sumAmount(expenses)}
              isFiltered={isFiltered}
              filterName={filter === 'all' ? 'tất cả các loại' : CATEGORY_NAME[filter]}
              keyword={keyword.trim()}
              lastAddedId={lastAddedId}
              onDelete={this.handleDelete}
              onReset={this.resetFilters}
            />
          </div>

          <div className="area-stats">
            <CategoryStats expenses={expenses} active={filter} onSelect={(id) => this.setState({ filter: id })} />
          </div>
        </main>
      </div>
    )
  }
}

export default App
