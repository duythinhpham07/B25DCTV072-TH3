import { Component } from 'react'
import { clockIcon, logoIcon, moonIcon, sunIcon } from './icons'

class Header extends Component {
  render() {
    const { theme, showClock, onToggleTheme, onToggleClock } = this.props
    const isDark = theme === 'dark'

    return (
      <header className="topbar">
        <div className="brand">
          <span className="brand-logo">{logoIcon}</span>
          <h1 className="brand-name">Sổ chi tiêu</h1>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="icon-btn"
            aria-pressed={showClock}
            onClick={onToggleClock}
            title={showClock ? 'Ẩn đồng hồ' : 'Hiện đồng hồ'}
          >
            {clockIcon}
            <span>{showClock ? 'Ẩn đồng hồ' : 'Hiện đồng hồ'}</span>
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--square"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={isDark ? 'Giao diện sáng' : 'Giao diện tối'}
          >
            {isDark ? sunIcon : moonIcon}
          </button>
        </div>
      </header>
    )
  }
}

export default Header
