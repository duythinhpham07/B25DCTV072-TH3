import { closeIcon, searchIcon } from './icons'

export default function SearchBox({ value, pending, onChange }) {
  return (
    <div className="search">
      <span className="search-icon">{searchIcon}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm theo nội dung"
        aria-label="Tìm khoản chi theo nội dung"
      />
      {pending && <span className="search-pending" aria-hidden="true" />}
      {value && !pending && (
        <button type="button" className="search-clear" onClick={() => onChange('')} aria-label="Xóa ô tìm kiếm">
          {closeIcon}
        </button>
      )}
    </div>
  )
}
