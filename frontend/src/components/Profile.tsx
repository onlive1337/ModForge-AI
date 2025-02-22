import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { useTranslation } from '../hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Profile({ isOpen, onClose }: ProfileProps) {
  const { user, updateUser, token, logout } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSettingChange = async (setting: string, value: string) => {
    if (!user || !token) return;

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
          >
            <div className="bg-background dark:bg-background rounded-lg border shadow-lg p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-background dark:bg-background pt-2 pb-4 border-b z-10">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-semibold"
                >
                  {t.profile.title}
                </motion.h2>
                <motion.button 
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
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
                      defaultValue={user.settings.defaultLoader}
                      onValueChange={(value) => handleSettingChange('defaultLoader', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-background dark:bg-background">
                        <SelectValue placeholder={t.profile.selectLoader} />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-background">
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
                      defaultValue={user.settings.defaultVersion}
                      onValueChange={(value) => handleSettingChange('defaultVersion', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-background dark:bg-background">
                        <SelectValue placeholder={t.profile.selectVersion} />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-background">
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
                      defaultValue={user.settings.theme}
                      onValueChange={(value) => handleSettingChange('theme', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-background dark:bg-background">
                        <SelectValue placeholder={t.profile.selectTheme} />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-background">
                        <SelectItem value="light">{t.theme.light}</SelectItem>
                        <SelectItem value="dark">{t.theme.dark}</SelectItem>
                        <SelectItem value="system">{t.profile.systemTheme}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.profile.language}</label>
                    <Select
                      defaultValue={user.settings.language}
                      onValueChange={(value) => handleSettingChange('language', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-background dark:bg-background">
                        <SelectValue placeholder={t.profile.selectLanguage} />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-background">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="w-full"
                  >
                    {t.profile.logout}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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