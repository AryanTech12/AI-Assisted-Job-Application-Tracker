import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanColumnType, Application } from '../types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick: (app: Application) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onCardClick }) => {
  return (
    <div className="flex flex-col bg-gray-100/50 dark:bg-slate-800/40 rounded-2xl w-80 flex-shrink-0 border border-gray-200 dark:border-slate-700 shadow-sm max-h-full transition-colors duration-500 backdrop-blur-sm">
      <div className="p-4 border-b border-gray-200/80 dark:border-slate-700 bg-white/40 dark:bg-slate-800/80 rounded-t-2xl flex justify-between items-center transition-colors duration-500">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{column.title}</h3>
        <span className="bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs py-1 px-3 rounded-full font-bold shadow-sm transition-colors duration-500">
           {column.applications.length}
        </span>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-all duration-300 min-h-[150px]
              ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/20 shadow-inner' : ''}
            `}
          >
            {column.applications.map((application, index) => (
              <KanbanCard 
                  key={application._id} 
                  application={application} 
                  index={index} 
                  onClick={onCardClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
