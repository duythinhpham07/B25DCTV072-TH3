import { useCallback, useEffect, useState } from 'react'

async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Máy chủ trả về lỗi ${res.status}`)
  return res.json()
}

export default function useFetch(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(url ? null : 'Chưa cấu hình VITE_API_URL trong file .env')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!url) return
    let ignore = false

    request(url)
      .then((json) => {
        if (!ignore) setData(json)
      })
      .catch((err) => {
        if (!ignore) setError(err.message === 'Failed to fetch' ? 'Không kết nối được tới máy chủ' : err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [url, reloadKey])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }, [])

  const addItem = useCallback(
    async (item) => {
      const created = await request(url, { method: 'POST', body: JSON.stringify(item) })
      setData((prev) => [created, ...prev])
      return created
    },
    [url],
  )

  const removeItem = useCallback(
    async (id) => {
      await request(`${url}/${id}`, { method: 'DELETE' })
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [url],
  )

  return { data, loading, error, reload, addItem, removeItem }
}
