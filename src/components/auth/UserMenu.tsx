import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth';
import { Button } from '../ui/Button';
import { LoginModal } from './LoginModal';

export const UserMenu: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, guestScore, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-medium">{user?.username}</p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Total Points:</span>
                <span className="font-semibold text-indigo-600">{user?.points}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            {guestScore > 0 && (
              <div className="text-sm">
                <span className="text-gray-500">Guest Points:</span>
                <span className="ml-1 font-semibold text-indigo-600">{guestScore}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};