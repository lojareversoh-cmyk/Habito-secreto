
import React, { useState } from 'react';
import { Habit, Screen, User } from '../types';
import { HABITS } from '../constants';
import MainLayout from './MainLayout';

interface Props {
  selectedHabits: Habit[];
  onToggle: (habit: Habit) => void;
  onContinue: () => void;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const HabitSelection: React.FC<Props> = ({
  selectedHabits,
  onToggle,
  onContinue,
  onBack,
  onNavigate,
  user,
  onLogout,
  onUpdateUser
}) => {
  const [customHabitName, setCustomHabitName] = useState('');
  const canContinue = selectedHabits.length >= 3;

  const handleCreateCustomHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedName = customHabitName.trim();
    if (!trimmedName) return;

    if (selectedHabits.length >= 5) {
      alert("Você pode selecionar no máximo 5 hábitos.");
      return;
    }

    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      category: 'Personalizado',
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&auto=format&fit=crop&q=60'
    };

    onToggle(newHabit);
    setCustomHabitName('');
  };

  return (
    <MainLayout
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
    >
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] mb-2">Prepare-se para o Desafio</h1>
            <p className="text-slate-500 dark:text-[#9db9a6] text-lg max-w-2xl">
              Escolha os hábitos que você vai compartilhar com seu parceiro secreto por 30 dias.
              <span className="text-primary font-medium"> Complete a meta para revelar a identidade dele(a).</span>
            </p>

            <form onSubmit={handleCreateCustomHabit} className="w-full bg-surface-light dark:bg-[#1c2a21] p-1 rounded-xl shadow-sm border border-gray-100 dark:border-none">
              <div className="flex items-center w-full">
                <div className="pl-4 text-slate-400"><span className="material-symbols-outlined">add_circle</span></div>
                <input
                  value={customHabitName}
                  onChange={(e) => setCustomHabitName(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9db9a6] h-12 sm:h-14 text-base"
                  placeholder="Não encontrou? Crie seu próprio desafio..."
                  type="text"
                />
                <button
                  type="submit"
                  disabled={!customHabitName.trim()}
                  className="m-1 h-10 sm:h-12 px-6 bg-primary text-[#102216] text-sm sm:text-base font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HABITS.map(habit => {
              const isSelected = selectedHabits.find(h => h.id === habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => onToggle(habit)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-surface-light dark:bg-[#1c2a21] border-2 p-4 transition-all hover:shadow-lg ${isSelected ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[#102216] z-10 shadow-lg animate-in fade-in zoom-in duration-300">
                      <span className="material-symbols-outlined text-base font-bold">check</span>
                    </div>
                  )}
                  <div className="aspect-square w-full mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#28392e] relative">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${habit.imageUrl}')` }}></div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 truncate">{habit.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-[#9db9a6] font-medium uppercase tracking-wider">{habit.category}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-surface-light dark:bg-[#1c2a21] rounded-2xl p-6 shadow-xl dark:shadow-none border border-gray-100 dark:border-none flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Meus Hábitos</h2>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md transition-all">
                  {selectedHabits.length} Selecionados
                </span>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium mb-2 text-slate-500 dark:text-[#9db9a6]">
                  <span>Progresso da seleção</span>
                  <span>{selectedHabits.length}/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-[#28392e] rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-700 ease-out" style={{ width: `${(selectedHabits.length / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-6 pr-1 scrollbar-hide">
                {selectedHabits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl">playlist_add</span>
                    </div>
                    <p className="text-sm font-medium">Selecione ou crie hábitos para começar sua jornada secreta.</p>
                  </div>
                ) : (
                  selectedHabits.map(habit => (
                    <div key={habit.id} className="flex items-center gap-3 p-3 bg-background-light dark:bg-[#111813] rounded-xl group border border-transparent hover:border-red-500/30 transition-all animate-in slide-in-from-right duration-300">
                      <div className="size-10 rounded-lg bg-cover bg-center shrink-0 shadow-inner" style={{ backgroundImage: `url('${habit.imageUrl}')` }}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{habit.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-[#9db9a6] font-black uppercase tracking-widest">{habit.category}</p>
                      </div>
                      <button onClick={() => onToggle(habit)} className="text-slate-400 hover:text-red-500 transition-colors p-1 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-4 flex gap-3 border border-blue-100 dark:border-blue-500/10">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0 text-xl">info</span>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-tight font-medium">
                  Seu parceiro secreto estará focado nos mesmos objetivos. Escolha com sabedoria para uma experiência de 30 dias transformadora.
                </p>
              </div>
              <button
                disabled={!canContinue}
                onClick={onContinue}
                className="w-full bg-primary hover:bg-primary/90 text-[#102216] font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
              >
                <span>Confirmar Desafio</span>
                <span className="material-symbols-outlined">flash_on</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="py-8 text-center text-slate-500 dark:text-[#9db9a6] text-sm">
        <p>© 2024 Desafio do Hábito Secreto. Disciplina gera liberdade.</p>
      </footer>
    </MainLayout>
  );
};

export default HabitSelection;
