import React, { useState } from 'react';
import { Screen, User, AppNotification } from '../types';

interface NavbarProps {
    onNavigate: (screen: Screen) => void;
    user: User;
    onLogout: () => void;
    onOpenProfile: () => void;
    notifications?: AppNotification[];
}

const Navbar: React.FC<NavbarProps> = ({
    onNavigate,
    user,
    onLogout,
    onOpenProfile,
    notifications = []
}) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-[#28392e] bg-background-light/95 dark:bg-[#111813]/95 backdrop-blur px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.DASHBOARD)}>
                        <div className="size-10 flex items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-2xl font-bold">shield_person</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight hidden sm:block">Hábito Secreto</h2>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => onNavigate(Screen.DASHBOARD)}
                            className="text-sm font-bold text-primary"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => onNavigate(Screen.SELECTION)}
                            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                        >
                            Desafios
                        </button>
                        <button
                            onClick={() => onNavigate(Screen.CHAT)}
                            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                        >
                            Parceiro
                        </button>
                    </nav>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowHistoryModal(!showHistoryModal)}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                        >
                            <span className="material-symbols-outlined text-slate-500">notifications</span>
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
                            )}
                        </button>

                        {/* Modal de Histórico de Notificações */}
                        {showHistoryModal && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                    <span className="font-bold text-sm">Notificações</span>
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase">Recentes</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 text-xs">Sem notificações no momento.</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                                                <p className="text-[10px] text-slate-400 leading-tight">{n.message}</p>
                                                <p className="text-[9px] text-slate-600 mt-2">{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-[#28392e] group"
                            >
                                <div
                                    className="bg-center bg-cover rounded-full size-8 ring-2 ring-primary/30 group-hover:ring-primary transition-all flex items-center justify-center bg-slate-800"
                                    style={user.profileImage ? { backgroundImage: `url('${user.profileImage}')` } : {}}
                                >
                                    {!user.profileImage && <span className="material-symbols-outlined text-xs text-slate-400">person</span>}
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-white/5">
                                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => { setShowProfileMenu(false); onOpenProfile(); }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">person</span>
                                            Meu Perfil
                                        </button>
                                        <button
                                            onClick={() => { setShowProfileMenu(false); onOpenProfile(); }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">settings</span>
                                            Configurações
                                        </button>
                                        <div className="h-px bg-white/5 my-1"></div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">logout</span>
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay para fechar modais */}
            {(showHistoryModal || showProfileMenu) && (
                <div className="fixed inset-0 z-40" onClick={() => { setShowHistoryModal(false); setShowProfileMenu(false); }}></div>
            )}
        </>
    );
};

export default Navbar;
