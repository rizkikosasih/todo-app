import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md glass p-8 rounded-2xl glow-primary">
        <h1 className="text-8xl font-black text-primary animate-pulse">404</h1>
        <h2 className="text-2xl font-bold">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground text-sm">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="flex items-center justify-center gap-2 mx-auto bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200">
          <Home size={18} />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
