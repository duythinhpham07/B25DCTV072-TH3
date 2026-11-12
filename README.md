# Bài thực hành 03 (N2): Sổ chi tiêu cá nhân

- Họ tên: **Phạm Duy Thịnh**
- Mã sinh viên: **B25DCTV072**
- Môn: Lập trình Web

Ứng dụng ghi lại các khoản chi hằng ngày (nội dung, số tiền, loại, ngày chi), viết hai lần:

| Thư mục | Cách viết | Dữ liệu |
| --- | --- | --- |
| `part-a-class` | Class Component | Dữ liệu mẫu viết sẵn trong code |
| `part-b-hooks` | Function Component + Hooks | mockapi.io qua custom hook `useFetch` |

Không dùng React Router, Redux hay thư viện UI. Giao diện tự viết bằng CSS, dạng tờ hóa đơn in ra từ máy in nhiệt.

## Cách chạy

Cần Node.js 20 trở lên.

### Phần A

```bash
cd part-a-class
npm install
npm run dev
```

### Phần B

```bash
cd part-b-hooks
npm install
npm run dev
```

Endpoint mockapi đã có sẵn trong file `part-b-hooks/.env`:

```
VITE_API_URL=https://6ad030cb03feaa52b21f18de.mockapi.io/api/v1/expenses
```

Resource `expenses` gồm các trường `title` (string), `amount` (number), `category` (string), `date` (string). Nếu dữ liệu trên mockapi bị xóa hết, chạy `npm run seed` để nạp lại 12 khoản chi mẫu.

Giá trị `category` gồm: `an-uong`, `di-lai`, `hoc-tap`, `giai-tri`.

## Chức năng

- Header có đồng hồ chạy từng giây, có nút ẩn/hiện đồng hồ (ẩn thì component bị gỡ và bộ đếm được dừng).
- Form thêm khoản chi có validate: nội dung 2–60 ký tự, số tiền từ 1.000đ đến 100.000.000đ, bắt buộc chọn loại, ngày chi không ở tương lai.
- Danh sách nhóm theo ngày, dùng `key` là `id`, nút Xóa có bước xác nhận ngay trên dòng.
- Lọc theo loại, dòng tổng tiền (tổng đang xem và tổng cả sổ), tiêu đề tab hiển thị tổng chi.
- Nâng cao: thống kê tổng tiền theo từng loại, ô tìm kiếm có debounce 400ms (gõ không dấu vẫn tìm được), giao diện sáng/tối.
- Phần B thêm: trạng thái đang tải và lỗi (có nút Tải lại), focus lại ô nhập sau khi thêm.

## Phần A: Class Component

- `App` giữ state: danh sách khoản chi, loại đang lọc, từ khóa, giao diện, ẩn/hiện đồng hồ.
- `Clock`: `componentDidMount` tạo `setInterval`, `componentWillUnmount` gọi `clearInterval`.
- `App.componentDidUpdate`: so sánh tổng chi cũ và mới để cập nhật `document.title`.
- Debounce tìm kiếm bằng `setTimeout` lưu trong `this.searchTimer`, hủy ở `componentWillUnmount`.

## Phần B: Function Component + Hooks

| Hook | Dùng để |
| --- | --- |
| `useState`, `useEffect` | state của các component, cập nhật tiêu đề tab |
| `useFetch` (custom) | lấy, thêm, xóa dữ liệu trên mockapi; trả về `loading`, `error`, `reload` |
| `useClock` (custom) | trả về thời gian hiện tại, tự dọn interval |
| `useDebounce` (custom) | làm trễ từ khóa tìm kiếm |
| `useRef` | focus lại ô "Việc cần chi tiêu" sau khi thêm thành công |
| `useContext` | chế độ sáng/tối dùng chung (`ThemeContext` + `useTheme`) |

## Hooks đã giúp khắc phục các thách thức của Class ở đâu trong bài

1. **Logic bị chia nhỏ theo vòng đời.** Ở Phần A, đồng hồ phải tạo interval trong `componentDidMount` và dọn ở `componentWillUnmount`, hai nơi cách xa nhau. Phần B gom cả hai vào một `useEffect` có hàm cleanup trong `useClock`.
2. **Khó tái sử dụng logic có state.** Đồng hồ, debounce và gọi API ở Phần A gắn chặt vào từng class. Phần B tách thành `useClock`, `useDebounce`, `useFetch`, dùng lại được ở bất kỳ component nào mà không cần HOC hay render props.
3. **`componentDidUpdate` phải tự so sánh `prevState`.** Phần A phải viết `if (tổng cũ !== tổng mới)` để cập nhật tiêu đề tab. Phần B chỉ cần khai báo `[total]` trong mảng phụ thuộc của `useEffect`.
4. **`this` và bind.** Class phải dùng arrow function cho các handler (`handleAdd = () => {}`) để giữ `this`. Function component không còn `this`.
5. **Hủy kết quả cũ khi gọi API.** `useFetch` dùng cờ `ignore` trong cleanup của `useEffect`, nên không bị set state sau khi component đã bị gỡ.
6. **Chia sẻ dữ liệu toàn cục.** Theme ở Phần A phải truyền qua props từ `App` xuống `Header`. Phần B dùng `useContext`, component nào cần thì tự lấy.

## Cấu trúc thư mục

```
part-a-class/src
  App.jsx                 state chính, lọc, debounce, tiêu đề tab
  components/             Header, Clock, ExpenseForm, FilterBar, SearchBox,
                          Receipt, ExpenseList, ExpenseItem, CategoryStats
  data/                   danh mục loại chi, dữ liệu mẫu
  utils/expense.js        định dạng tiền, lọc, thống kê, validate

part-b-hooks/src
  App.jsx
  components/             giống Phần A nhưng viết bằng function
  context/                ThemeContext, ThemeProvider
  hooks/                  useFetch, useClock, useDebounce, useTheme
  data/, utils/
```
