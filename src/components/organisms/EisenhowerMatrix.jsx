import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import { getQuadrantInfo } from '@/utils/helpers';

export default function EisenhowerMatrix({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  className = '' 
}) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverQuadrant, setDragOverQuadrant] = useState(null);

  const quadrants = [
    'urgent-important',
    'not-urgent-important', 
    'urgent-not-important',
    'not-urgent-not-important'
  ];

  const getTasksByQuadrant = (quadrant) => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverQuadrant(null);
  };

  const handleDragOver = (e, quadrant) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverQuadrant(quadrant);
  };

  const handleDragLeave = () => {
    setDragOverQuadrant(null);
  };

  const handleDrop = (e, quadrant) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.quadrant !== quadrant) {
      onTaskUpdate?.(draggedTask.Id, { quadrant });
    }
    
    setDraggedTask(null);
    setDragOverQuadrant(null);
  };

  return (
    <div className={`matrix-grid ${className}`}>
      {quadrants.map((quadrant) => {
        const quadrantInfo = getQuadrantInfo(quadrant);
        const quadrantTasks = getTasksByQuadrant(quadrant);
        const isDragOver = dragOverQuadrant === quadrant;

        return (
          <motion.div
            key={quadrant}
            layout
            className={`
              p-4 rounded-lg border-2 transition-all min-h-[300px]
              ${quadrantInfo.color}
              ${isDragOver ? 'quadrant-drag-over' : ''}
            `}
            onDragOver={(e) => handleDragOver(e, quadrant)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, quadrant)}
          >
            {/* Quadrant Header */}
            <div className="mb-4">
              <h3 className="font-semibold text-surface-900 text-lg">
                {quadrantInfo.title}
              </h3>
              <p className="text-sm text-surface-600">
                {quadrantInfo.subtitle}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-surface-500">
                  {quadrantTasks.length} task{quadrantTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {quadrantTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onComplete={onTaskComplete}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedTask?.Id === task.Id}
                />
              ))}

              {quadrantTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-surface-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}