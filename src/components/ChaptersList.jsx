import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ChaptersList({ onSelect }) {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_BASE}/chapters`)
        if (!res.ok) throw new Error('Gagal memuat daftar bab')
        const data = await res.json()
        setChapters(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchChapters()
  }, [])

  if (loading) return <p className="text-blue-200">Memuat bab...</p>
  if (error) return <p className="text-red-300">{error}</p>

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {chapters.map(ch => (
        <button
          key={ch.id}
          onClick={() => onSelect(ch)}
          className="text-left bg-slate-800/50 border border-blue-500/20 hover:border-blue-400/40 rounded-xl p-4 transition-colors"
        >
          <h3 className="text-white font-semibold mb-1">{ch.title}</h3>
          <p className="text-blue-200/80 text-sm line-clamp-3">{ch.summary}</p>
        </button>
      ))}
    </div>
  )
}

export default ChaptersList
