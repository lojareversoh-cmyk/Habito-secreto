
export enum Screen {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  SELECTION = 'SELECTION',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  REVEAL = 'REVEAL'
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  sender: 'me' | 'partner' | 'system';
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'milestone';
  timestamp: Date;
  read: boolean;
}

export interface HistoryEntry {
  day: number;
  date: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  profileImage?: string;
}
