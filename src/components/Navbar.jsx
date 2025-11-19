import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/70 border-b border-blue-500/20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Flames" className="w-8 h-8" />
          <span className="text-white font-semibold tracking-tight">Belajar Biologi</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-blue-200 hover:text-white transition-colors">Beranda</Link>
          <a href="/test" className="text-blue-200 hover:text-white transition-colors">Tes Koneksi</a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
