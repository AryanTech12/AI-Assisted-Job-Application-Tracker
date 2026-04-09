import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Application } from '../types';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface KanbanCardProps {
  application: Application;
  index: number;
  onClick: (app: Application) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ application, index, onClick }) => {
  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(application)}
          style={{
             ...provided.draggableProps.style,
          }}
          className={`bg-white dark:bg-slate-800 p-4 mb-3 rounded-xl border cursor-pointer hover:shadow-xl transition-colors duration-300 transform-3d-hover
            ${snapshot.isDragging ? 'border-blue-500 shadow-2xl scale-105 z-50 dark:border-blue-400 rotate-2' : 'border-gray-200 dark:border-slate-700 shadow-sm'}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white leading-tight">{application.role}</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">{application.company}</p>
          
          <div className="space-y-1.5">
            {application.location && (
               <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                  {application.location}
               </div>
            )}
            {application.seniority && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                  {application.seniority}
               </div>
            )}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
               <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
               {new Date(application.dateApplied).toLocaleDateString()}
            </div>
          </div>

          {application.skills && application.skills.length > 0 && (
             <div className="mt-4 flex flex-wrap gap-1.5">
                {application.skills.slice(0, 3).map((skill, i) => (
                   <span key={i} className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md text-[10px] font-semibold tracking-wide border border-blue-100 dark:border-blue-800/50">
                      {skill}
                   </span>
                ))}
                {application.skills.length > 3 && (
                   <span className="inline-block px-2 py-0.5 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md text-[10px] font-semibold tracking-wide border border-gray-200 dark:border-slate-600">
                      +{application.skills.length - 3}
                   </span>
                )}
             </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
