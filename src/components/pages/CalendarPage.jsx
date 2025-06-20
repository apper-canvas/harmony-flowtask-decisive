import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { taskService } from '@/services';
import { getPriorityColor, formatRelativeDate } from '@/utils/helpers';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
try {
      const tasksData = await taskService.getAll();
      
      // Map database fields to frontend format
      const mappedTasks = (tasksData || []).map(task => ({
        ...task,
        title: task.title || task.Name,
        dueDate: task.due_date,
        projectId: task.project_id,
        tags: task.Tags ? task.Tags.split(',').filter(tag => tag.trim()) : [],
        estimatedMinutes: parseInt(task.estimated_minutes) || null,
        actualMinutes: parseInt(task.actual_minutes) || null
      }));
      
      setTasks(mappedTasks);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  const handleTaskReschedule = async (taskId, newDate) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        dueDate: format(newDate, 'yyyy-MM-dd')
      });
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      toast.success('Task rescheduled');
    } catch (error) {
      console.error('Failed to reschedule task:', error);
      toast.error('Failed to reschedule task');
    }
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-7 gap-4 mb-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-6 bg-surface-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(21)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">Something went wrong</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadTasks} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-surface-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Calendar</h1>
            <p className="text-surface-600 mt-1">
              Week of {format(weekStart, 'MMMM d, yyyy')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigateWeek(-1)}
              variant="outline"
              icon="ChevronLeft"
              size="sm"
            />
            
            <Button
              onClick={goToToday}
              variant="outline"
              size="sm"
            >
              Today
            </Button>
            
            <Button
              onClick={() => navigateWeek(1)}
              variant="outline"
              icon="ChevronRight"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-7 divide-x divide-surface-200">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col min-h-0"
              >
                {/* Day Header */}
                <div className={`
                  flex-shrink-0 p-4 border-b border-surface-200 text-center
                  ${isCurrentDay ? 'bg-primary/5' : 'bg-surface-50'}
                `}>
                  <div className="text-sm font-medium text-surface-600 mb-1">
                    {format(day, 'EEEE')}
                  </div>
                  <div className={`
                    text-lg font-semibold
                    ${isCurrentDay ? 'text-primary' : 'text-surface-900'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  {dayTasks.length > 0 && (
                    <Badge variant="primary" size="xs" className="mt-1">
                      {dayTasks.length}
                    </Badge>
                  )}
                </div>

                {/* Tasks */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {dayTasks.map((task) => (
                    <motion.div
                      key={task.Id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTask(task)}
                      className={`
                        p-2 rounded-lg text-xs cursor-pointer transition-all
                        ${getPriorityColor(task.priority)}
                        ${task.status === 'completed' ? 'opacity-60' : ''}
                      `}
                    >
                      <div className="font-medium mb-1 line-clamp-2">
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={task.priority} size="xs">
                          {task.priority}
                        </Badge>
                        {task.estimatedMinutes && (
                          <div className="flex items-center gap-1 text-surface-500">
                            <ApperIcon name="Clock" size={10} />
                            <span>{Math.round(task.estimatedMinutes / 60 * 10) / 10}h</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {dayTasks.length === 0 && (
                    <div className="text-center text-surface-400 py-8">
                      <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No tasks scheduled</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTask(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">
                {selectedTask.title}
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {selectedTask.description && (
              <p className="text-surface-600 mb-4">
                {selectedTask.description}
              </p>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <ApperIcon name="Flag" size={16} className="text-surface-400" />
                <Badge variant={selectedTask.priority} size="sm">
                  {selectedTask.priority} priority
                </Badge>
              </div>

              {selectedTask.dueDate && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                  <span className="text-sm text-surface-600">
                    Due {formatRelativeDate(selectedTask.dueDate)}
                  </span>
                </div>
              )}

              {selectedTask.estimatedMinutes && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Clock" size={16} className="text-surface-400" />
                  <span className="text-sm text-surface-600">
                    Estimated {Math.round(selectedTask.estimatedMinutes / 60 * 10) / 10} hours
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setSelectedTask(null)}
                variant="outline"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.info('Task editing coming soon!');
                  setSelectedTask(null);
                }}
                icon="Edit2"
              >
                Edit Task
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}