
import React, { useState, useCallback, useEffect } from 'react';
import { Screen, Habit, Message, AppNotification, HistoryEntry, User } from './types';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import HabitSelection from './components/HabitSelection';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import RevealScreen from './components/RevealScreen';
import NotificationToast from './components/NotificationToast';

import { supabase } from './services/supabaseClient';

const STORAGE_KEY = 'habito_secreto_data_v1';

const App: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(12);
  const [isDoneToday, setIsDoneToday] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'partner',
      text: 'E aí! Conseguiu beber os 2L de água hoje? Eu acabei de encher minha garrafa pela quarta vez! 💧',
      timestamp: '08:45'
    }
  ]);

  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // User is logged in, fetch profile
        fetchUserProfile(session.user.id, session.user.email || '');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
        // If on Landing/Auth, move to Dashboard or Selection
        if (currentScreen === Screen.LANDING || currentScreen === Screen.AUTH) {
          // We can check if habits exist later, for now go to Selection
          // Or rely on the logic inside fetchUserProfile if we wanted
        }
      } else {
        setUser(null);
        setCurrentScreen(Screen.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data: logs } = await supabase.from('habit_logs').select('*').eq('user_id', user.id);

    // Normalize today
    const todayStr = new Date().toISOString().split('T')[0];

    if (logs) {
      const doneToday = logs.some(log => log.date === todayStr && log.completed);
      setIsDoneToday(doneToday);

      // Rebuild history based on last 30 days
      const newHistory = Array.from({ length: 30 }, (_, i) => {
        const dateObj = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000); // 30 days ending today
        const dateStr = dateObj.toISOString().split('T')[0];
        const isCompleted = logs.some(log => log.date === dateStr && log.completed);
        return {
          day: i + 1,
          date: dateObj.toISOString(),
          completed: isCompleted
        };
      });
      setHistory(newHistory);
      // Simple streak calculation: count logs or consecutive? Using count for now.
      setStreak(logs.filter(l => l.completed).length);
    }
  };

  const fetchUserProfile = async (userId: string, email: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();

    const userData: User = {
      id: userId,
      name: profile?.name || email.split('@')[0],
      email: email,
      isLoggedIn: true,
      profileImage: profile?.avatar_url
    };
    setUser(userData);

    // If just logging in and screens were Landing/Auth, navigate
    // Use function form of setState to avoiding dependency cycles if needed, 
    // but here we just check currentScreen ref or assume logic elsewhere.
    // For simplicity, we let the handleAuthComplete logic equivalent run here or rely on the user to navigate?
    // Actually, standard flow: 
    // User is set -> Effects trigger save.
    // Navigation is manual in handleAuthComplete.
    // But if session is restored on refresh, we should ensure we are on a valid screen.
    // Logic below handles restoration from localStorage for screen.
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // We override user from Supabase, so don't load user from local storage unless offline support needed
        // if (parsed.user) setUser(parsed.user); 

        if (parsed.currentScreen) setCurrentScreen(parsed.currentScreen);
        if (parsed.selectedHabits) setSelectedHabits(parsed.selectedHabits);
        if (parsed.streak) setStreak(parsed.streak);
        if (parsed.isDoneToday !== undefined) setIsDoneToday(parsed.isDoneToday);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.notifications) {
          setNotifications(parsed.notifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        }
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    } else {
      setHistory(Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
        completed: i < 11
      })));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const dataToSave = {
      // user, // Don't save user to local storage if using Supabase, or save as cache
      currentScreen,
      selectedHabits,
      streak,
      isDoneToday,
      history,
      chatMessages,
      notifications
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [currentScreen, selectedHabits, streak, isDoneToday, history, chatMessages, notifications, isHydrated]);

  const addNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'milestone' = 'info') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSelectedHabits([]);
    navigateTo(Screen.LANDING);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleAuthComplete = (userData: User) => {
    // setUser(userData); // Supabase listener will handle this
    addNotification('Acesso Liberado', `Bem-vindo de volta, ${userData.name}!`, 'success');

    if (selectedHabits.length > 0) {
      navigateTo(Screen.DASHBOARD);
    } else {
      navigateTo(Screen.SELECTION);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    addNotification('Perfil Atualizado', 'Suas informações foram salvas com sucesso.', 'success');
  };

  const toggleHabit = (habit: Habit) => {
    setSelectedHabits(prev => {
      const isSelected = prev.find(h => h.id === habit.id);
      if (isSelected) return prev.filter(h => h.id !== habit.id);
      if (prev.length >= 5) return prev;
      return [...prev, habit];
    });
  };

  const handleMarkAsDone = async () => {
    if (isDoneToday || !user) return;

    // Optimistic Update
    setIsDoneToday(true);
    const todayStr = new Date().toISOString().split('T')[0];

    setHistory(prev => prev.map(entry => {
      const entryDate = entry.date.split('T')[0];
      if (entryDate === todayStr) return { ...entry, completed: true };
      return entry;
    }));
    setStreak(prev => prev + 1);

    const { error } = await supabase.from('habit_logs').insert({
      user_id: user.id,
      habit_id: 'daily_goal',
      date: todayStr,
      completed: true
    });

    if (error) {
      console.error("Error saving log", error);
      // Revert (simplified)
      setIsDoneToday(false);
      setStreak(prev => prev - 1);
      addNotification('Erro', 'Não foi possível salvar o progresso.', 'error');
    } else {
      addNotification('Meta Concluída!', 'Você finalizou suas tarefas de hoje.', 'success');
      setTimeout(() => {
        addNotification('Sincronia Total!', 'Seu parceiro secreto também concluiu os hábitos de hoje.', 'milestone');
      }, 2000);
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen font-body selection:bg-primary selection:text-background-dark overflow-x-hidden">
      <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end pointer-events-none w-full max-w-sm">
        {notifications.filter(n => !n.read).slice(0, 3).map(n => (
          <NotificationToast key={n.id} notification={n} onClose={removeNotification} />
        ))}
      </div>



      {currentScreen === Screen.LANDING && (
        <LandingPage onStart={() => navigateTo(Screen.AUTH)} onLogin={() => navigateTo(Screen.AUTH)} />
      )}
      {currentScreen === Screen.AUTH && (
        <AuthScreen onAuthComplete={handleAuthComplete} onBack={() => navigateTo(Screen.LANDING)} />
      )}
      {currentScreen === Screen.SELECTION && (
        <HabitSelection
          selectedHabits={selectedHabits}
          onToggle={toggleHabit}
          onContinue={() => {
            navigateTo(Screen.DASHBOARD);
            addNotification('Desafio Iniciado', 'Boa sorte na sua jornada de 30 dias!', 'info');
          }}
          onBack={() => navigateTo(Screen.DASHBOARD)}
          onNavigate={navigateTo}
          user={user!}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentScreen === Screen.DASHBOARD && (
        <Dashboard
          streak={streak}
          isDoneToday={isDoneToday}
          notifications={notifications}
          history={history}
          onMarkAsDone={handleMarkAsDone}
          onOpenChat={() => navigateTo(Screen.CHAT)}
          onForceReveal={() => navigateTo(Screen.REVEAL)}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          user={user!}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentScreen === Screen.CHAT && (
        <Chat
          messages={chatMessages}
          setMessages={setChatMessages}
          onBack={() => navigateTo(Screen.DASHBOARD)}
          onNavigate={navigateTo}
          user={user!}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentScreen === Screen.REVEAL && (
        <RevealScreen onRestart={handleLogout} />
      )}
    </div>
  );
};

export default App;
