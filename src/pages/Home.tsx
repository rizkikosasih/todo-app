import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTodoStore } from '../store/useTodoStore';
import { useTheme } from '../components/ThemeProvider';
import { TodoItem } from '../components/TodoItem';
import { DashboardStats } from '../components/DashboardStats';
import { PriorityLevel } from '../types';
import confetti from 'canvas-confetti';
import {
  LogOut,
  Sun,
  Moon,
  Plus,
  ListTodo,
  Sparkles,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const {
    todos,
    stats,
    filter,
    setFilter,
    triggerConfetti,
    resetConfetti,
    fetchTodos,
    fetchStats,
    addTodo
  } = useTodoStore();

  // New Todo Form State
  const [todoText, setTodoText] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync session and fetch data
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Subscribe real-time
    const unsubscribeTodos = fetchTodos(user.uid);
    const unsubscribeStats = fetchStats(user.uid);

    return () => {
      unsubscribeTodos();
      unsubscribeStats();
    };
  }, [user, navigate, fetchTodos, fetchStats]);

  // Confetti celebration trigger
  useEffect(() => {
    if (triggerConfetti) {
      // Fire confetti burst
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Reset trigger state
      resetConfetti();
    }
  }, [triggerConfetti, resetConfetti]);

  if (!user) return null;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addTodo(
        user.uid,
        todoText.trim(),
        priority,
        category.trim() || 'General',
        dueDate
      );
      setTodoText('');
      setPriority('medium');
      setCategory('');
      setDueDate('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await logout();
      navigate('/');
    }
  };

  // Filter tasks based on selected tab
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'complete') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-12 left-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">
              T
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block">
                Todo App V2
              </span>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase flex items-center gap-1">
                <Sparkles size={8} /> Gamified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Summary */}
            <div className="flex items-center gap-2 border-r pr-3 border-border/80">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center border border-primary/20">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline-block">
                {user.displayName || 'Pengguna'}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-border/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
              title="Keluar">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Stats */}
        <DashboardStats todos={todos} stats={stats} />

        {/* Create Task Card */}
        <div className="glass rounded-3xl p-6 border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-primary w-5 h-5" />
            <h3 className="text-sm font-bold text-foreground">Buat Tugas Baru</h3>
          </div>

          <form onSubmit={handleAddTodo} className="space-y-4">
            {/* Main Input Text */}
            <div className="relative">
              <input
                type="text"
                required
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                placeholder="Apa yang ingin Anda selesaikan hari ini?"
                className="w-full bg-background/50 border border-border/80 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder:text-muted-foreground/60 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-2 p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-md">
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
              </button>
            </div>

            {/* Additional parameters input line */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Priority Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                  Prioritas
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-background/50 border border-border/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50">
                  <option value="low">Low (Biru)</option>
                  <option value="medium">Medium (Kuning)</option>
                  <option value="high">High (Merah)</option>
                </select>
              </div>

              {/* Category input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                  Kategori / Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Contoh: Work, Personal, Study"
                  className="w-full bg-background/50 border border-border/80 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* Due Date picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider px-1">
                  Tenggat Waktu (Due Date)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-background/50 border border-border/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Task List / Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListTodo className="text-primary w-5 h-5" />
              <h3 className="text-sm font-bold text-foreground">Daftar Tugas Anda</h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex border border-border/80 rounded-xl p-1 bg-background/40 self-start sm:self-auto">
              {(['all', 'incomplete', 'complete'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all capitalize ${
                    filter === t
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  {t === 'all' ? 'Semua' : t === 'incomplete' ? 'Aktif' : 'Selesai'}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
              ) : (
                <div className="glass rounded-3xl p-12 text-center border border-border/40 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto text-muted-foreground/60">
                    <ClipboardList size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Tidak Ada Tugas</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Belum ada tugas di kategori ini. Tambahkan tugas baru di atas untuk
                    mulai produktif!
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
