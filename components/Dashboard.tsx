import React, { useState } from 'react';
import { AppNotification, HistoryEntry, Screen, User } from '../types';
import MainLayout from './MainLayout';
import { generateCalendarGrid, MONTH_NAMES } from '../utils/calendar';

interface Props {
  streak: number;
  isDoneToday: boolean;
  notifications: AppNotification[];
  history: HistoryEntry[];
  onMarkAsDone: () => void;
  onOpenChat: () => void;
  onForceReveal: () => void;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

const Dashboard: React.FC<Props> = ({
  streak,
  isDoneToday,
  notifications,
  history,
  onMarkAsDone,
  onOpenChat,
  onForceReveal,
  onNavigate,
  onLogout,
  user,
  onUpdateUser
}) => {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const calendarDays = generateCalendarGrid(currentMonth, currentYear);
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const getHistoryStatus = (day: number) => {
    // Find history entry for this specific date
    // Note: History logic in App.tsx generates dates. We match by comparing YYYY-MM-DD
    const targetDateStr = new Date(currentYear, currentMonth, day).toDateString(); // "Mon Dec 29 2025"

    // Check if we have history for this date
    // In App.tsx history is generated with ISO strings.
    const entry = history.find(h => new Date(h.date).toDateString() === targetDateStr);

    if (entry?.completed) return 'completed';

    // Logic for "Lost" or "Future"
    const checkDate = new Date(currentYear, currentMonth, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (checkDate < now) return 'lost';
    if (checkDate > now) return 'future'; // Actually today is handled by isToday check mainly

    return 'pending'; // Today and not completed
  };

  return (
    <MainLayout
      onNavigate={onNavigate}
      user={user!}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
      notifications={notifications}
    >
      <div className="flex-1 w-full p-4 md:p-8 flex flex-col gap-8">
        {/* Card Principal de Progresso */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Ativo</span>
                <span className="text-xs text-slate-400 font-medium">Jornada em Progresso</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                Dia {streak} <span className="text-slate-400 dark:text-slate-600 font-normal text-2xl md:text-3xl">/ 30</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mb-8">
                Você e seu parceiro estão em perfeita sincronia. Mais {Math.max(0, 30 - streak)} dias para a revelação.
              </p>

              <div className="flex gap-4">
                <button
                  disabled={isDoneToday}
                  onClick={onMarkAsDone}
                  className={`flex-1 md:flex-none px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${isDoneToday
                    ? 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 cursor-default shadow-none border border-transparent'
                    : 'bg-primary text-background-dark hover:scale-105 active:scale-95 shadow-primary/20'
                    }`}
                >
                  <span className="material-symbols-outlined">{isDoneToday ? 'check_circle' : 'bolt'}</span>
                  {isDoneToday ? 'Meta de Hoje Concluída' : 'Concluir Meta de Hoje'}
                </button>
              </div>
            </div>

            <div className="w-full md:w-72 flex flex-col gap-6 justify-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Sua Jornada</span>
                    <span className="text-primary">{Math.min(100, Math.round((streak / 30) * 100))}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(19,236,91,0.5)]" style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Histórico de Hábitos (Calendário Real) */}
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calendário de Hábitos</p>
            </div>

            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-400 tracking-widest mb-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="aspect-square"></div>;

              const status = getHistoryStatus(day);
              const today = isToday(day);

              const isFuture = status === 'future';
              const isLost = status === 'lost';
              const isCompleted = status === 'completed';

              return (
                <div
                  key={day}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-500 group
                    ${isCompleted
                      ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(19,236,91,0.2)]'
                      : today
                        ? 'bg-primary/10 border-2 border-primary border-dashed animate-pulse text-primary'
                        : isLost
                          ? 'bg-red-500/10 border border-red-500/20 text-red-500/60'
                          : 'bg-slate-50 dark:bg-black/20 text-slate-400 border border-slate-100 dark:border-white/5'
                    }
                    ${isFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  `}
                >
                  <span className={`text-[9px] font-black leading-none mb-1 ${isCompleted ? 'opacity-60' : isFuture ? 'opacity-40' : ''}`}>
                    {day < 10 ? `0${day}` : day}
                  </span>

                  {isCompleted ? (
                    <span className="material-symbols-outlined text-lg font-bold">check</span>
                  ) : today ? (
                    <span className="material-symbols-outlined text-lg animate-bounce">priority_high</span>
                  ) : isLost ? (
                    <span className="material-symbols-outlined text-lg">close</span>
                  ) : (
                    <span className="material-symbols-outlined text-lg opacity-10">radio_button_unchecked</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Grid de Ações Secundárias */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={onOpenChat}
            className="bg-surface-dark border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-primary/30 transition-all group flex items-center gap-6"
          >
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">chat_bubble</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Chat Secreto</h3>
              <p className="text-slate-400 text-sm">O parceiro enviou uma mensagem motivadora.</p>
            </div>
          </div>

          <div
            onClick={onForceReveal}
            className="bg-surface-dark border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-blue-400/30 transition-all group flex items-center gap-6"
          >
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">lock_open</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Ver Identidade</h3>
              <p className="text-slate-400 text-sm">Disponível em breve (Clique para demo).</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
