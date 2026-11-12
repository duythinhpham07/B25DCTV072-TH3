export const CATEGORIES = [
  { id: 'an-uong', name: 'Ăn uống' },
  { id: 'di-lai', name: 'Đi lại' },
  { id: 'hoc-tap', name: 'Học tập' },
  { id: 'giai-tri', name: 'Giải trí' },
]

export const CATEGORY_NAME = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]))
