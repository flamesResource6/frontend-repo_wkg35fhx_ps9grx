import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ChaptersList from './components/ChaptersList'
import ChapterDetail from './components/ChapterDetail'
import Quiz from './components/Quiz'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [view, setView] = useState('list') // list | detail | quiz
  const [currentChapter, setCurrentChapter] = useState(null)
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    // Attempt to seed minimal content on first load (idempotent)
    const seed = async () => {
      try {
        await fetch(`${API_BASE}/seed`, { method: 'POST' })
        setSeeded(true)
      } catch (e) {
        setSeeded(false)
      }
    }
    seed()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <Navbar />
      <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Platform Belajar Biologi</h1>
          <p className="text-blue-200">Ringkasan materi per bab dan kuis pilihan ganda level olimpiade dengan pembahasan.</p>
        </div>

        {view === 'list' && (
          <div className="space-y-6">
            <h2 className="text-white font-semibold">Daftar Bab</h2>
            <ChaptersList onSelect={(ch) => { setCurrentChapter(ch); setView('detail') }} />
          </div>
        )}

        {view === 'detail' && currentChapter && (
          <ChapterDetail
            slug={currentChapter.slug}
            onBack={() => setView('list')}
            onStartQuiz={(slug) => { setView('quiz') }}
          />
        )}

        {view === 'quiz' && currentChapter && (
          <Quiz slug={currentChapter.slug} onBack={() => setView('detail')} />
        )}
      </main>
    </div>
  )
}

export default App
