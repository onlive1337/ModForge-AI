import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { useTranslation } from '../hooks/useTranslation';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Profile({ isOpen, onClose }: ProfileProps) {
  const { user, updateUser, token, logout } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const versions = [
    { version: '1.20.4', loaders: ['forge', 'fabric', 'quilt', 'neoforge'] },
    { version: '1.20.2', loaders: ['forge', 'fabric', 'quilt', 'neoforge'] },
    { version: '1.20.1', loaders: ['forge', 'fabric', 'quilt'] },
    { version: '1.19.4', loaders: ['forge', 'fabric', 'quilt'] },
    { version: '1.19.2', loaders: ['forge', 'fabric', 'quilt'] },
    { version: '1.18.2', loaders: ['forge', 'fabric', 'quilt'] },
    { version: '1.17.1', loaders: ['forge', 'fabric'] },
    { version: '1.16.5', loaders: ['forge', 'fabric'] },
    { version: '1.15.2', loaders: ['forge', 'fabric'] },
    { version: '1.14.4', loaders: ['forge', 'fabric'] },
    { version: '1.12.2', loaders: ['forge'] },
    { version: '1.8.9', loaders: ['forge'] },
    { version: '1.7.10', loaders: ['forge'] }
  ];

  const handleSettingChange = async (setting: string, value: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          settings: {
            ...user.settings,
            [setting]: value
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.profile.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t.profile.accountInfo}</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">{t.profile.username}:</span> {user.username}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">{t.profile.email}:</span> {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t.profile.settings}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.profile.defaultLoader}</label>
              <Select
                value={user.settings.defaultLoader}
                onValueChange={(value: string) => handleSettingChange('defaultLoader', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.profile.selectLoader} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forge">Forge</SelectItem>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="quilt">Quilt</SelectItem>
                  <SelectItem value="neoforge">NeoForge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.profile.defaultVersion}</label>
              <Select
                value={user.settings.defaultVersion}
                onValueChange={(value: string) => handleSettingChange('defaultVersion', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.profile.selectVersion} />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((item) => (
                    <SelectItem key={item.version} value={item.version}>
                      {item.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.profile.theme}</label>
              <Select
                value={user.settings.theme}
                onValueChange={(value: string) => handleSettingChange('theme', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.profile.selectTheme} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.theme.light}</SelectItem>
                  <SelectItem value="dark">{t.theme.dark}</SelectItem>
                  <SelectItem value="system">{t.profile.systemTheme}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.profile.language}</label>
              <Select
                value={user.settings.language}
                onValueChange={(value: string) => handleSettingChange('language', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.profile.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full"
            >
              {t.profile.logout}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}