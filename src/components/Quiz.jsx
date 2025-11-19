import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Quiz({ slug, onBack }) {
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_BASE}/chapters/${slug}/quiz?limit=20`)
        if (!res.ok) throw new Error('Gagal memuat kuis')
        const data = await res.json()
        setQuestions(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [slug])

  const score = useMemo(() => {
    return questions.reduce((acc, q, i) => {
      const a = answers[i]
      return acc + (a === q.correct_index ? 1 : 0)
    }, 0)
  }, [answers, questions])

  if (loading) return <p className="text-blue-200">Memuat soal...</p>
  if (error) return <p className="text-red-300">{error}</p>
  if (!questions.length) return (
    <div>
      <p className="text-blue-200">Belum ada soal untuk bab ini.</p>
      <button onClick={onBack} className="text-blue-300 hover:text-white mt-2">← Kembali</button>
    </div>
  )

  const q = questions[idx]
  const finished = idx >= questions.length

  if (finished) {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Hasil Kuis</h3>
        <p className="text-blue-200">Skor: {score}/{questions.length} ({percent}%)</p>
        <div className="space-y-3">
          {questions.map((qq, i) => (
            <div key={qq.id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
              <p className="text-white font-medium mb-2">{i+1}. {qq.question}</p>
              <ul className="text-sm text-blue-200/90 mb-2">
                {qq.options.map((opt, oi) => (
                  <li key={oi} className={oi === qq.correct_index ? 'text-green-300' : (answers[i] === oi ? 'text-red-300' : '')}>
                    {String.fromCharCode(65+oi)}. {opt}
                  </li>
                ))}
              </ul>
              <p className="text-blue-300">Penjelasan: {qq.explanation}</p>
            </div>
          ))}
        </div>
        <button onClick={onBack} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Kembali ke Bab</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-blue-300 hover:text-white">← Kembali</button>
        <span className="text-blue-200">Soal {idx + 1} dari {questions.length}</span>
      </div>
      <h3 className="text-2xl font-bold text-white">{q.question}</h3>
      <div className="grid gap-3">
        {q.options.map((opt, oi) => (
          <label key={oi} className={`cursor-pointer bg-slate-800/50 border rounded-xl p-3 transition-colors ${answers[idx] === oi ? 'border-blue-400/50' : 'border-blue-500/20 hover:border-blue-400/40'}`}>
            <input
              type="radio"
              name={`q-${idx}`}
              className="hidden"
              checked={answers[idx] === oi}
              onChange={() => setAnswers(a => ({ ...a, [idx]: oi }))}
            />
            <span className="text-white">{String.fromCharCode(65+oi)}. {opt}</span>
          </label>
        ))}
      </div>

      {answers[idx] != null && (
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
          {answers[idx] === q.correct_index ? (
            <p className="text-green-300">Benar! {q.explanation}</p>
          ) : (
            <p className="text-red-300">Kurang tepat. {q.explanation}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button disabled={idx===0} onClick={() => setIdx(i => Math.max(0, i-1))} className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50">Sebelumnya</button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx(i => Math.min(questions.length, i+1))} className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Berikutnya</button>
        ) : (
          <button onClick={() => setIdx(questions.length)} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Selesai</button>
        )}
      </div>
    </div>
  )
}

export default Quiz
