import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import KanbanColumn from './KanbanColumn';
import { Application, KanbanColumnType } from '../types';

const COLUMNS = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

interface KanbanBoardProps {
   onCardClick: (app: Application) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onCardClick }) => {
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<{ [key: string]: KanbanColumnType }>({});

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get('/applications');
      return res.data as Application[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  useEffect(() => {
    if (applications) {
      const initialColumns: { [key: string]: KanbanColumnType } = {};
      COLUMNS.forEach((col) => {
        initialColumns[col] = {
          id: col,
          title: col,
          applications: applications.filter((app) => app.status === col),
        };
      });
      setColumns(initialColumns);
    }
  }, [applications]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    if (sourceCol.id === destCol.id) {
       // Reordering within the same column
       const newApps = Array.from(sourceCol.applications);
       const [movedElement] = newApps.splice(source.index, 1);
       newApps.splice(destination.index, 0, movedElement);

       setColumns({
          ...columns,
          [sourceCol.id]: {
             ...sourceCol,
             applications: newApps
          }
       });
       return;
    }

    // Moving between columns
    const sourceApps = Array.from(sourceCol.applications);
    const destApps = Array.from(destCol.applications);
    const [movedElement] = sourceApps.splice(source.index, 1);
    
    // Update local state optimistic UI
    const updatedElement = { ...movedElement, status: destCol.id as Application['status'] };
    destApps.splice(destination.index, 0, updatedElement);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, applications: sourceApps },
      [destination.droppableId]: { ...destCol, applications: destApps },
    });

    // Fire API request
    updateStatusMutation.mutate({ id: draggableId, status: destCol.id });
  };

  if (isLoading) {
     return (
        <div className="flex h-full items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
     );
  }

  return (
     <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-[calc(100vh-140px)] gap-6 overflow-x-auto pb-4 px-2 custom-scrollbar">
          {COLUMNS.map((colId) => {
             const col = columns[colId];
             if (!col) return null;
             return <KanbanColumn key={col.id} column={col} onCardClick={onCardClick} />;
          })}
        </div>
     </DragDropContext>
  );
};

export default KanbanBoard;
