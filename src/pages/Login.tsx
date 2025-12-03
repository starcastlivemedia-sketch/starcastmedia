import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader, CheckCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Check for email confirmation redirect
  useEffect(() => {
    const type = searchParams.get('type');
    const email_from_url = searchParams.get('email');
    
    if (type === 'recovery' || type === 'signup') {
      setSuccess('Email confirmed! You can now log in.');
      if (email_from_url) {
        setEmail(decodeURIComponent(email_from_url));
      }
    }

    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [searchParams, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      // Give auth state time to update
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('Email not confirmed')) {
        setError('Please confirm your email address first. Check your inbox for a confirmation link.');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark">
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-400 mb-2">Starcast Media</h1>
              <p className="text-gray-400">Employee Portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="text-red-400" size={20} />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-green-300 text-sm">{success}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
