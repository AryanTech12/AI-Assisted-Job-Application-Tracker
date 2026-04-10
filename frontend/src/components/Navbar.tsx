import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, MonitorSmartphone } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem('jobTrackerUser');
  const user = userData ? JSON.parse(userData) : null;
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    localStorage.removeItem('jobTrackerUser');
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
               <MonitorSmartphone className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
               <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 tracking-tight">
                  AI AppTracker
               </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
               onClick={toggleTheme}
               className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
               title="Toggle Dark Mode"
            >
               {theme === 'dark' ? <Sun className="w-5 h-5 animate-pulse-slow" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-semibold rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-4 ml-2">
                <Link to="/login" className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 outline outline-2 outline-offset-2 outline-transparent hover:outline-blue-600/30 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-300 shadow-md hover:shadow-blue-500/50">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
