import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const inputClasses = "w-full bg-[var(--bg-interactive)]/50 p-3 mt-1 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <div className="flex border-b border-[var(--border-primary)] mb-6">
                 <button onClick={() => setIsLogin(true)} className={`w-1/2 py-3 font-medium transition-colors ${isLogin ? 'border-b-2 border-[var(--accent-secondary)] text-[var(--accent-secondary-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                    Login
                </button>
                 <button onClick={() => setIsLogin(false)} className={`w-1/2 py-3 font-medium transition-colors ${!isLogin ? 'border-b-2 border-[var(--accent-secondary)] text-[var(--accent-secondary-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                    Sign Up
                </button>
            </div>

            <h1 className="text-3xl font-serif text-[var(--text-header)] text-center mb-2">
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-center text-[var(--text-secondary)] mb-6">
                to AcademiaOS
            </p>

            {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)]">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)]">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} minLength={6} />
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </div>
                 <p className="text-xs text-center text-[var(--text-muted)] pt-2">
                    This is a mock authentication for demonstration. Any email/password will work.
                 </p>
            </form>
        </Card>
    </div>
  );
};

export default Auth;
