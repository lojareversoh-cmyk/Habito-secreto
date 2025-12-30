import React, { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import ProfileSettings from './ProfileSettings';
import { Screen, User, AppNotification } from '../types';

interface MainLayoutProps {
    children: ReactNode;
    onNavigate: (screen: Screen) => void;
    user: User;
    onLogout: () => void;
    onUpdateUser?: (user: User) => void;
    notifications?: AppNotification[];
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    onNavigate,
    user,
    onLogout,
    notifications,
    onUpdateUser
}) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
            <Navbar
                onNavigate={onNavigate}
                user={user}
                onLogout={onLogout}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                notifications={notifications}
            />
            <main className="flex-1 w-full max-w-7xl mx-auto">
                {children}
            </main>

            {isProfileModalOpen && (
                <ProfileSettings
                    user={user}
                    onClose={() => setIsProfileModalOpen(false)}
                    onUpdate={(updatedUser) => {
                        if (onUpdateUser) onUpdateUser(updatedUser);
                    }}
                />
            )}
        </div>
    );
};

export default MainLayout;
