
import React, { useEffect } from 'react';
import { AppNotification } from '../types';

interface Props {
  notification: AppNotification;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<Props> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const icons = {
    success: 'check_circle',
    info: 'notifications',
    milestone: 'workspace_premium'
  };

  const colors = {
    success: 'text-primary border-primary/30',
    info: 'text-blue-400 border-blue-400/30',
    milestone: 'text-yellow-400 border-yellow-400/30'
  };

  return (
    <div className={`flex items-center gap-4 p-4 mb-3 rounded-2xl bg-[#1c2a21]/90 backdrop-blur-xl border ${colors[notification.type]} shadow-2xl shadow-black/50 animate-slide-in-right max-w-sm w-full pointer-events-auto`}>
      <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${colors[notification.type]}`}>
        <span className="material-symbols-outlined">{icons[notification.type]}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-white">{notification.title}</h4>
        <p className="text-xs text-slate-400 line-clamp-2">{notification.message}</p>
      </div>
      <button onClick={() => onClose(notification.id)} className="text-slate-500 hover:text-white transition-colors">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export default NotificationToast;
