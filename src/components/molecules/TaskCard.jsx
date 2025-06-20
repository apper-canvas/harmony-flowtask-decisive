import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { getPriorityColor, formatRelativeDate } from '@/utils/helpers';

export default function TaskCard({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
  className = '' 
}) {
  const priorityColor = getPriorityColor(task.priority);
  const relativeDueDate = formatRelativeDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, task);
    }
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd(e, task);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, shadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        bg-white rounded-lg border border-surface-200 p-4 cursor-move transition-all
        ${isDragging ? 'task-dragging' : ''}
        ${task.status === 'completed' ? 'opacity-60' : ''}
        ${className}
      `.trim()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-surface-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-surface-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {task.status !== 'completed' && (
            <button
              onClick={() => onComplete?.(task.Id)}
              className="p-1 rounded hover:bg-success/10 text-surface-400 hover:text-success transition-colors"
              title="Mark as complete"
            >
              <ApperIcon name="Check" size={16} />
            </button>
          )}
          
          <button
            onClick={() => onEdit?.(task)}
            className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
            title="Edit task"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          
          <button
            onClick={() => onDelete?.(task.Id)}
            className="p-1 rounded hover:bg-error/10 text-surface-400 hover:text-error transition-colors"
            title="Delete task"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="default" size="xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <Badge variant={task.priority} size="xs" icon="Flag">
            {task.priority}
          </Badge>
          
          {/* Estimated time */}
          {task.estimatedMinutes && (
            <div className="flex items-center gap-1 text-surface-500">
              <ApperIcon name="Clock" size={12} />
              <span>{Math.round(task.estimatedMinutes / 60 * 10) / 10}h</span>
            </div>
          )}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-error' : 'text-surface-500'}`}>
            <ApperIcon name="Calendar" size={12} />
            <span className={isOverdue ? 'font-medium' : ''}>
              {relativeDueDate}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar for subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-surface-100">
          <div className="flex items-center justify-between text-xs text-surface-500 mb-1">
            <span>Subtasks</span>
            <span>0/{task.subtasks.length}</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}