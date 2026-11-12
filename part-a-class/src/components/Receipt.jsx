import { Component } from 'react'
import { formatMoney } from '../utils/expense'
import ExpenseList from './ExpenseList'

class Receipt extends Component {
  render() {
    const { expenses, total, grandTotal, isFiltered, filterName, keyword, lastAddedId, onDelete, onReset } = this.props

    let emptyText = 'Sổ đang trống. Ghi khoản chi đầu tiên ở khung bên cạnh.'
    if (isFiltered) emptyText = 'Không có khoản nào khớp với bộ lọc hiện tại.'

    return (
      <div className="receipt-stage">
        <div className="printer" aria-hidden="true">
          <span className="printer-led" />
        </div>
        <div className="receipt-feed">
          <article className="receipt" aria-label="Danh sách khoản chi">
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

            <ExpenseList expenses={expenses} lastAddedId={lastAddedId} onDelete={onDelete} emptyText={emptyText} />

            {isFiltered && expenses.length === 0 && (
              <button type="button" className="btn-ghost receipt-reset" onClick={onReset}>
                Bỏ lọc và tìm kiếm
              </button>
            )}

            <footer className="receipt-foot">
              <div className="receipt-row">
                <span>Số khoản</span>
                <span>{expenses.length}</span>
              </div>
              {isFiltered && (
                <div className="receipt-row">
                  <span>Tổng cả sổ</span>
                  <span>{formatMoney(grandTotal)}</span>
                </div>
              )}
              <div className="receipt-total" aria-live="polite">
                <span>{isFiltered ? 'Tổng đang xem' : 'Tổng cộng'}</span>
                <strong>{formatMoney(total)}</strong>
              </div>
              <div className="barcode" aria-hidden="true" />
            </footer>
          </article>
        </div>
      </div>
    )
  }
}

export default Receipt
