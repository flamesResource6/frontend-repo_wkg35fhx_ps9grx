import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ChapterDetail({ slug, onBack, onStartQuiz }) {
  const [chapter, setChapter] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await fetch(`${API_BASE}/chapters/${slug}`)
        if (!res.ok) throw new Error('Bab tidak ditemukan')
        const data = await res.json()
        setChapter(data)
      } catch (e) {
        setError(e.message)
      }
    }
    fetchChapter()
  }, [slug])

  if (error) return <p className="text-red-300">{error}</p>
  if (!chapter) return <p className="text-blue-200">Memuat...</p>

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-300 hover:text-white">← Kembali</button>
      <h2 className="text-3xl font-bold text-white">{chapter.title}</h2>
      <p className="text-blue-200/90">{chapter.summary}</p>

      <div className="space-y-6">
        {chapter.sections?.map((sec, idx) => (
          <section key={idx} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">{sec.heading}</h3>
            <p className="text-blue-200/80 whitespace-pre-wrap">{sec.body}</p>
          </section>
        ))}
      </div>

      <div>
        <h4 className="text-white font-semibold mb-2">Tujuan Pembelajaran</h4>
        <ul className="list-disc list-inside text-blue-200/90">
          {chapter.objectives?.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </div>

      <button
        onClick={() => onStartQuiz(chapter.slug)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Mulai Kuis Bab (20 Soal)
      </button>
    </div>
  )
}

export default ChapterDetail
