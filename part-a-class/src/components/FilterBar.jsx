import { Component } from 'react'
import { CATEGORIES } from '../data/categories'

const OPTIONS = [{ id: 'all', name: 'Tất cả' }, ...CATEGORIES]

class FilterBar extends Component {
  render() {
    const { value, counts, onChange } = this.props

    return (
      <div className="filter-bar" role="group" aria-label="Lọc theo loại">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`chip cat-${o.id}`}
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.id !== 'all' && <span className="cat-swatch" aria-hidden="true" />}
            {o.name}
            <span className="chip-count">{counts[o.id] || 0}</span>
          </button>
        ))}
      </div>
    )
  }
}

export default FilterBar
