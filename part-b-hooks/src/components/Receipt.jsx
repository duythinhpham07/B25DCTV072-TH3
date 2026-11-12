import { formatMoney } from '../utils/expense'
import ExpenseList from './ExpenseList'

export default function Receipt({
  expenses,
  total,
  grandTotal,
  isFiltered,
  filterName,
  keyword,
  lastAddedId,
  loading,
  error,
  onRetry,
  onDelete,
  onReset,
}) {
  const emptyText = isFiltered
    ? 'Không có khoản nào khớp với bộ lọc hiện tại.'
    : 'Sổ đang trống. Thêm khoản chi đầu tiên ở khung bên cạnh.'

  let printerClass = 'printer'
  if (loading) printerClass += ' is-busy'
  else if (error) printerClass += ' is-error'

  let body
  if (loading) {
    body = (
      <div className="receipt-status" role="status">
        <strong>Đang tải sổ chi tiêu…</strong>
        <div className="skeleton" aria-hidden="true" style={{ width: '100%' }}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  } else if (error) {
    body = (
      <div className="receipt-status" role="alert">
        <strong>Không tải được dữ liệu</strong>
        <p>{error}. Kiểm tra kết nối mạng hoặc địa chỉ mockapi rồi thử lại.</p>
        <button type="button" className="btn-ghost" onClick={onRetry}>
          Tải lại
        </button>
      </div>
    )
  } else {
    body = (
      <>
        <ExpenseList expenses={expenses} lastAddedId={lastAddedId} onDelete={onDelete} emptyText={emptyText} />
        {isFiltered && expenses.length === 0 && (
          <button type="button" className="btn-ghost receipt-reset" onClick={onReset}>
            Bỏ lọc và tìm kiếm
          </button>
        )}
      </>
    )
  }

  const ready = !loading && !error

  return (
    <div className="receipt-stage">
      <div className={printerClass} aria-hidden="true">
        <span className="printer-led" />
      </div>
      <div className="receipt-feed">
        <article className="receipt" aria-label="Danh sách khoản chi" aria-busy={loading}>
          <header className="receipt-head">
            <p className="receipt-shop">Sổ chi tiêu cá nhân</p>
            <p>Phạm Duy Thịnh, MSV B25DCTV072</p>
            <p>
              Đang xem: {filterName}
              {keyword && <>, có chữ “{keyword}”</>}
            </p>
          </header>

          <div className="receipt-cols" aria-hidden="true">
            <span>Nội dung</span>
            <span>Số tiền</span>
          </div>

          {body}

          <footer className="receipt-foot">
            <div className="receipt-row">
              <span>Số khoản</span>
              <span>{ready ? expenses.length : '--'}</span>
            </div>
            {ready && isFiltered && (
              <div className="receipt-row">
                <span>Tổng cả sổ</span>
                <span>{formatMoney(grandTotal)}</span>
              </div>
            )}
            <div className="receipt-total" aria-live="polite">
              <span>{isFiltered ? 'Tổng đang xem' : 'Tổng cộng'}</span>
              <strong>{ready ? formatMoney(total) : '--'}</strong>
            </div>
            <div className="barcode" aria-hidden="true" />
          </footer>
        </article>
      </div>
    </div>
  )
}
