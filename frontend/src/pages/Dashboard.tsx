import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import ApplicationModal from '../components/ApplicationModal';
import { Application } from '../types';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined);

  useEffect(() => {
    const user = localStorage.getItem('jobTrackerUser');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleOpenNewModal = () => {
    setSelectedApplication(undefined);
    setIsModalOpen(true);
  };

  const handleCardClick = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-500 overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col h-[calc(100vh-64px)]">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Application Pipeline</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your job hunt gracefully.</p>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="group flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            Add Application
          </button>
        </div>

        <div className="flex-1 relative z-10 w-full perspective-1000">
           <KanbanBoard onCardClick={handleCardClick} />
        </div>
        
      </main>

      {isModalOpen && (
        <ApplicationModal 
          onClose={() => setIsModalOpen(false)} 
          application={selectedApplication} 
        />
      )}
    </div>
  );
};

export default Dashboard;
