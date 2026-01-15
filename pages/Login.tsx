import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (password === 'admin') {
      onLogin(true);
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-surfaceHighlight rounded-2xl border border-surface shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-textMain">Staff Access</h1>
          <p className="text-textMuted text-sm mt-1">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-textMuted uppercase ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-surface border ${error ? 'border-secondary' : 'border-surfaceHighlight focus:border-primary'} rounded-xl px-4 py-3 pl-11 text-textMain outline-none transition-all`}
                placeholder="••••••••"
                autoFocus
              />
              <Lock className="absolute left-3.5 top-3.5 text-textMuted w-5 h-5" />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-secondary text-xs mt-2 px-1 animate-in slide-in-from-left-2">
                <AlertCircle size={12} />
                <span>Invalid password provided.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            Access Dashboard <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-textMuted/50">
            Protected area. IP address logged.
          </p>
        </div>
      </div>
    </div>
  );
};