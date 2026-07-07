import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Flame, Award, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, loading, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal masuk menggunakan akun Google Anda. Silakan coba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading && !isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md glass p-8 rounded-3xl glow-primary space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Todo App <span className="text-primary font-black">V2</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Level up your productivity, task by task.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 py-2">
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
              <Flame size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Daily Streaks</h3>
              <p className="text-muted-foreground text-xs">
                Jaga konsistensi harian Anda dan bangun rantai produktivitas.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                XP & Leveling System
              </h3>
              <p className="text-muted-foreground text-xs">
                Dapatkan +10 XP untuk setiap tugas yang diselesaikan. Naikkan level Anda!
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                Advanced Subtasks & Tags
              </h3>
              <p className="text-muted-foreground text-xs">
                Pecah tugas menjadi sub-checklist, kelola prioritas, dan kategori warna.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 text-xs bg-destructive/15 text-destructive rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-bold py-3.5 px-6 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg">
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Masuk dengan Google
              </>
            )}
          </button>
          <div className="text-center">
            <span className="text-muted-foreground text-xs">
              Sesi masuk aman & terenkripsi oleh Firebase Auth
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
