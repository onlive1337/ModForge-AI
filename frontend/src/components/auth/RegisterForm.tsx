import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { useTranslation } from '../../hooks/useTranslation';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errors.register);
      }

      setAuth(data.user, data.token);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : t.errors.default);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      
      <div className="space-y-2">
        <Input
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder={t.auth.usernamePlaceholder}
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder={t.auth.emailPlaceholder}
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder={t.auth.passwordPlaceholder}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? t.auth.registering : t.auth.register}
      </Button>
    </form>
  );
}