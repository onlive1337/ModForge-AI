import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useTranslation } from '../../hooks/useTranslation';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'login' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('login')}
            >
              {t.auth.login}
            </Button>
            <Button
              variant={mode === 'register' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('register')}
            >
              {t.auth.register}
            </Button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}