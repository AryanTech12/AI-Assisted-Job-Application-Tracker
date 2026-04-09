import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MonitorSmartphone, Rocket } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
     if (localStorage.getItem('theme') === 'dark') {
         document.documentElement.classList.add('dark');
     }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      localStorage.setItem('jobTrackerUser', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden flex-col">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-400/20 dark:bg-green-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="mb-8 flex items-center relative z-10">
         <MonitorSmartphone className="w-10 h-10 mr-3 text-blue-600 dark:text-blue-400" />
         <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 tracking-tight drop-shadow-sm">
            AI AppTracker
         </span>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(20,83,45,0.3)] border border-white/20 dark:border-slate-700/50 relative z-10 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(20,83,45,0.5)] transition-all duration-500">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
            Start tracking your tech career like a pro
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 dark:text-red-400 p-3 rounded-xl text-center font-medium">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 mb-2">Email address</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 mb-2">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900 transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white mr-2"></div>
                    Creating...
                </div>
              ) : (
                 <>
                   <Rocket className="w-5 h-5 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                   Register
                 </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
