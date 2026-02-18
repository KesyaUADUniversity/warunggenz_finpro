import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-black/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span 
            className="font-black text-xl tracking-tighter drop-shadow-[0_0_8px_#ff00ff]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            pos warung Gen z
          </span>
        </div>

        {/* Desktop: Dua tombol */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/register"
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Daftar
          </Link>
          <Link
            to="/login"
            className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/20"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Login
          </Link>
        </div>

        {/* Mobile: Satu tombol utama */}
        <div className="md:hidden">
          <Link
            to="/login"
            className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 px-4 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/20"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Graffiti kiri (DA) */}
        <div className="absolute -top-12 left-0 w-[200px] h-[280px] opacity-60">
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <text
              x="50"
              y="200"
              fontSize="160"
              fontWeight="900"
              fill="#ff00ff"
              fontFamily="Orbitron, sans-serif"
              className="drop-shadow-[0_0_12px_#ff00ff]"
            >
              DA
            </text>
          </svg>
        </div>

        {/* Graffiti kanan (JAN) */}
        <div className="absolute -bottom-12 right-0 w-[220px] h-[300px] opacity-60">
          <svg viewBox="0 0 200 350" className="w-full h-full">
            <text
              x="150"
              y="280"
              fontSize="180"
              fontWeight="900"
              fill="#00ffff"
              fontFamily="Orbitron, sans-serif"
              className="drop-shadow-[0_0_12px_#00ffff]"
            >
              JAN
            </text>
          </svg>
        </div>

        {/* Konten Utama */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1
            className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              textShadow: `
                0 0 12px #ff00ff,
                0 0 24px #ff00ff,
                0 0 36px #00ffff
              `,
              WebkitTextStroke: '2px #000',
              WebkitTextFillColor: 'transparent',
            }}
          >
            RASA LOKAL,<br />
            <span 
              className="block mt-2" 
              style={{ 
                textShadow: '0 0 12px #00ffff, 0 0 24px #ff00ff',
                fontFamily: 'Orbitron, sans-serif'
              }}
            >
              GAYA GLOBAL
            </span>
          </h1>

          <p 
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Warung modern yang menghargai cita rasa Nusantara, dikemas dengan teknologi untuk generasi Z.
          </p>

          {/* 🔥 CTA Button untuk Pelanggan */}
          <Link
            to="/customer"
            className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-700 hover:via-purple-700 hover:to-cyan-600 px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-105 shadow-2xl shadow-pink-500/30"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            PESAN SEKARANG
          </Link>
        </div>

        
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
            <div 
              className="w-full h-64 bg-center bg-no-repeat bg-contain bg-black"
              style={{ backgroundImage: `url("http://localhost:8000/storage/products/rendangpedas.jpg")` }}
            />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 
                className="text-xl font-bold text-white drop-shadow-[0_0_4px_#000]"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                RENDANG PEDAS LEVEL DEWA
              </h3>
              <p 
                className="text-lg text-cyan-300 font-bold"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Rp 25.000 | Siap dalam 5 menit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-800">
        <p 
          className="text-gray-500"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          © {new Date().getFullYear()} Warung Gen Z adalah pokoknya
        </p>
        <p 
          className="text-sm mt-1 text-cyan-400 font-bold"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Rasa Lokal, Gaya Global
        </p>
      </footer>
    </div>
  );
}