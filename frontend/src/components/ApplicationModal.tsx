import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Application } from '../types';
import { X, Sparkles, Copy, CheckCircle, Trash2, Save } from 'lucide-react';

interface ParserModalProps {
  onClose: () => void;
  application?: Application;
}

const ApplicationModal: React.FC<ParserModalProps> = ({ onClose, application }) => {
  const queryClient = useQueryClient();
  const [jdText, setJdText] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    company: application?.company || '',
    role: application?.role || '',
    location: application?.location || '',
    seniority: application?.seniority || '',
    skills: application?.skills || [],
    resumeSuggestions: application?.resumeSuggestions || [],
    status: application?.status || 'Applied',
  });

  const parseMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/parse', { jdText });
      return res.data;
    },
    onSuccess: (data) => {
      setFormData({
        ...formData,
        company: data.company !== 'Unknown' ? data.company : '',
        role: data.role !== 'Unknown' ? data.role : '',
        location: data.location !== 'Unknown' ? data.location : '',
        seniority: data.seniority !== 'Unknown' ? data.seniority : '',
        skills: data.skills || [],
        resumeSuggestions: data.resume_suggestions || [],
      });
      setJdText('');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
       if (application) {
          await api.put(`/applications/${application._id}`, formData);
       } else {
          await api.post('/applications', formData);
       }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
       if (application) {
          await api.delete(`/applications/${application._id}`);
       }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onClose();
    },
  });

  const copyToClipboard = (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in zoom-in-95">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
             {application ? 'Edit Application' : 'New Application Tracker'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
           {/* Left Column */}
           <div className="w-full md:w-1/2 p-6 border-r border-gray-100 dark:border-slate-700 overflow-y-auto custom-scrollbar">
              {!application && jdText === '' && formData.company === '' && (
                 <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                       Paste Job Description to Auto-Fill
                    </label>
                    <textarea
                       className="w-full h-80 p-4 border border-blue-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm bg-blue-50/30 dark:bg-slate-900/50 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 transition-all shadow-inner"
                       placeholder="Paste the full job description here..."
                       value={jdText}
                       onChange={(e) => setJdText(e.target.value)}
                    />
                    <button
                       onClick={() => parseMutation.mutate()}
                       disabled={!jdText || parseMutation.isPending}
                       className="w-full relative overflow-hidden group flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                       <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-700 ease-out skew-x-12"></div>
                       {parseMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                             <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                             <span>AI is analyzing...</span>
                          </div>
                       ) : (
                          <>
                             <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                             Parse with AI
                          </>
                       )}
                    </button>
                 </div>
              )}

              {/* Parsed Fields */}
              {(formData.company !== '' || application) && (
                 <div className="space-y-6">
                    <div className="relative group">
                        <label className="absolute -top-2.5 left-2 bg-white dark:bg-slate-800 px-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Company</label>
                        <input
                           className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl py-3 px-3 dark:bg-slate-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none font-semibold text-lg transition-colors"
                           value={formData.company}
                           onChange={(e) => setFormData({...formData, company: e.target.value})}
                        />
                    </div>
                    <div className="relative group">
                        <label className="absolute -top-2.5 left-2 bg-white dark:bg-slate-800 px-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Role</label>
                        <input
                           className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl py-3 px-3 dark:bg-slate-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none font-medium transition-colors"
                           value={formData.role}
                           onChange={(e) => setFormData({...formData, role: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group w-1/2">
                           <label className="absolute -top-2.5 left-2 bg-white dark:bg-slate-800 px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Location</label>
                           <input
                              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm dark:bg-slate-900 dark:text-slate-300 focus:border-blue-500 outline-none transition-colors"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                           />
                        </div>
                        <div className="relative group w-1/2">
                           <label className="absolute -top-2.5 left-2 bg-white dark:bg-slate-800 px-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seniority</label>
                           <input
                              className="w-full border border-gray-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm dark:bg-slate-900 dark:text-slate-300 focus:border-blue-500 outline-none transition-colors"
                              value={formData.seniority}
                              onChange={(e) => setFormData({...formData, seniority: e.target.value})}
                           />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Required Skills</label>
                        <div className="flex flex-wrap gap-2">
                           {formData.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm">
                                 {skill}
                              </span>
                           ))}
                        </div>
                    </div>
                 </div>
              )}
           </div>

           {/* Right Column: AI Suggestions */}
           <div className="w-full md:w-1/2 p-6 bg-gray-50/50 dark:bg-slate-900 overflow-y-auto custom-scrollbar relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none"></div>
              
              <div className="mb-6 flex items-center justify-between relative z-10">
                 <h3 className="font-bold text-gray-800 dark:text-white flex items-center text-lg">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3">
                       <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Tailored Resume Tips
                 </h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                 {formData.resumeSuggestions.length > 0 ? (
                    formData.resumeSuggestions.map((suggestion, idx) => (
                       <div key={idx} className="group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                          <p className="text-sm text-gray-700 dark:text-slate-300 pr-8 leading-relaxed font-medium">{suggestion}</p>
                          <button 
                             onClick={() => copyToClipboard(suggestion, idx)}
                             className="absolute top-5 right-5 p-2 bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors border border-gray-200 dark:border-slate-600"
                          >
                             {copied === idx ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                       </div>
                    ))
                 ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-800/50">
                       <Sparkles className="w-10 h-10 mb-3 opacity-20" />
                       <p className="text-sm font-medium">Parse a job description to unlock<br/>tailored resume bullet points.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center rounded-b-3xl">
           <div>
              {application && (
                 <button 
                    onClick={() => deleteMutation.mutate()}
                    className="flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                 >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                 </button>
              )}
           </div>
           <div className="flex gap-3">
              <button 
                 onClick={onClose}
                 className="px-6 py-2.5 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 font-bold transition-all"
              >
                 Cancel
              </button>
              <button 
                 onClick={() => saveMutation.mutate()}
                 disabled={formData.company === '' || saveMutation.isPending}
                 className="flex items-center px-8 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                 <Save className="w-4 h-4 mr-2" />
                 {saveMutation.isPending ? 'Saving...' : 'Save & Track'}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ApplicationModal;
