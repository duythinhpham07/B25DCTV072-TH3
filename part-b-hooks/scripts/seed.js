import { readFileSync } from 'node:fs'
import sampleExpenses from '../src/data/sampleExpenses.js'

const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const url = env.match(/^VITE_API_URL=(.+)$/m)?.[1].trim()

if (!url) {
  console.error('Chưa có VITE_API_URL trong file .env')
  process.exit(1)
}

for (const item of [...sampleExpenses].reverse()) {
  const { title, amount, category, date } = item
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, category, date }),
  })
  console.log(res.status, title)
}
