import { Todo, UserStats } from '../types';
import { Award, Flame, Calendar, CheckCircle2 } from 'lucide-react';

interface DashboardStatsProps {
  todos: Todo[];
  stats: UserStats;
}

export const DashboardStats = ({ todos, stats }: DashboardStatsProps) => {
  // Generate data for the last 7 days
  const getPast7Days = () => {
    const dates = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const temp = new Date();
      temp.setDate(d.getDate() - i);
      const offset = temp.getTimezoneOffset();
      const localDate = new Date(temp.getTime() - offset * 60 * 1000);
      dates.push(localDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  const past7Days = getPast7Days();

  const chartData = past7Days.map((dateStr) => {
    const count = todos.filter((t: Todo) => {
      if (!t.completed || !t.timestamp) return false;
      const tDate = new Date(t.timestamp);
      const offset = tDate.getTimezoneOffset();
      const tLocalDate = new Date(t.timestamp - offset * 60 * 1000);
      const tDateStr = tLocalDate.toISOString().split('T')[0];
      return tDateStr === dateStr;
    }).length;

    // Get localized day name
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
    return { dateStr, count, dayName };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count), 1); // Avoid division by zero

  // Overall calculations
  const totalCompleted = todos.filter((t: Todo) => t.completed).length;
  const totalActive = todos.filter((t: Todo) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Gamification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level & XP Card */}
        <div className="glass rounded-2xl p-5 border border-border/80 flex items-center gap-4 glow-primary">
          <div className="p-3 bg-primary/15 text-primary rounded-2xl shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                Tingkat Produktivitas
              </span>
              <span className="text-xs font-bold text-primary">{stats.xp} / 100 XP</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
              Level {stats.level}
            </h2>
            {/* Custom Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2.5 mt-2 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.xp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="glass rounded-2xl p-5 border border-border/80 flex items-center gap-4">
          <div className="p-3 bg-orange-500/15 text-orange-500 rounded-2xl shrink-0">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold">
              Streak Harian
            </span>
            <h2 className="text-xl font-extrabold mt-0.5">{stats.streak} Hari Aktif</h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.streak > 0
                ? 'Luar biasa! Pertahankan streak Anda hari ini.'
                : 'Selesaikan minimal 1 todo hari ini untuk memulai streak!'}
            </p>
          </div>
        </div>

        {/* Task Summary Card */}
        <div className="glass rounded-2xl p-5 border border-border/80 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-2xl shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold">
              Ringkasan Tugas
            </span>
            <h2 className="text-xl font-extrabold mt-0.5">{totalCompleted} Selesai</h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              Terdapat{' '}
              <span className="font-semibold text-foreground">
                {totalActive} tugas aktif
              </span>{' '}
              yang belum diselesaikan.
            </p>
          </div>
        </div>
      </div>

      {/* Productivity Chart Card */}
      <div className="glass rounded-3xl p-6 border border-border/80">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-primary w-5 h-5" />
          <h3 className="text-sm font-bold text-foreground">
            Produktivitas Mingguan (7 Hari Terakhir)
          </h3>
        </div>

        {/* SVG Custom Chart */}
        <div className="relative h-44 w-full flex items-end justify-between px-2 pt-6">
          {chartData.map((d) => {
            const barHeightPct = (d.count / maxCount) * 100;
            // Limit minimum height to 4px for empty days to keep it looking nice
            const displayHeight = Math.max(barHeightPct, 4);

            return (
              <div key={d.dateStr} className="flex flex-col items-center flex-1 group">
                {/* Count tooltip above bar */}
                <span
                  className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1.5 absolute"
                  style={{ bottom: `${displayHeight * 1.1 + 30}px` }}>
                  {d.count} tugas
                </span>

                {/* Bar */}
                <div className="w-8 sm:w-10 bg-secondary rounded-t-lg relative overflow-hidden border border-border h-32 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-purple-500 rounded-t-md transition-all duration-700 ease-out"
                    style={{ height: `${displayHeight}%` }}
                  />
                </div>

                {/* Day name */}
                <span className="text-xs text-muted-foreground font-semibold mt-2.5">
                  {d.dayName}
                </span>
              </div>
            );
          })}

          {/* Grid background lines */}
          <div className="absolute inset-0 -z-10 flex flex-col justify-between pointer-events-none opacity-30 pb-7">
            <div className="border-b border-border w-full h-0" />
            <div className="border-b border-border w-full h-0" />
            <div className="border-b border-border w-full h-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
