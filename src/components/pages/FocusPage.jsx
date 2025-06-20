import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FocusTimer from '@/components/molecules/FocusTimer';
import { taskService, focusSessionService } from '@/services';

export default function FocusPage() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isInFocus, setIsInFocus] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, statsData] = await Promise.all([
        taskService.getByStatus('pending'),
        focusSessionService.getTodayStats()
      ]);
      
      // Filter out completed tasks and sort by priority
      const pendingTasks = tasksData.filter(task => task.status !== 'completed');
      const sortedTasks = pendingTasks.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      setTasks(sortedTasks);
      setSessionStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startFocusSession = async (task, duration = 25) => {
    try {
      const session = await focusSessionService.create({
        taskId: task.Id.toString(),
        duration,
        type: duration === 25 ? 'pomodoro' : 'custom'
      });
      
      setCurrentTask(task);
      setCurrentSession(session);
      setIsInFocus(true);
      
      // Update task status to in-progress
      await taskService.update(task.Id, { status: 'in-progress' });
      
      toast.success(`Focus session started for "${task.title}"`);
    } catch (error) {
      console.error('Failed to start focus session:', error);
      toast.error('Failed to start focus session');
    }
  };

  const completeFocusSession = async () => {
    if (!currentSession) return;

    try {
      await focusSessionService.complete(currentSession.Id);
      
      // Update task with actual time spent
      if (currentTask) {
        const actualMinutes = (currentTask.actualMinutes || 0) + currentSession.duration;
        await taskService.update(currentTask.Id, { 
          actualMinutes,
          status: 'completed' // Mark as completed after focus session
        });
      }
      
      setIsInFocus(false);
      setCurrentTask(null);
      setCurrentSession(null);
      
      // Reload data to reflect changes
      loadData();
      
      toast.success('🎉 Focus session completed! Great work!');
    } catch (error) {
      console.error('Failed to complete focus session:', error);
      toast.error('Failed to complete focus session');
    }
  };

  const pauseFocusSession = () => {
    toast.info('Focus session paused. Take a short break!');
  };

  const stopFocusSession = async () => {
    if (!currentSession) return;

    try {
      // Just end the session without marking task as complete
      setIsInFocus(false);
      setCurrentTask(null);
      setCurrentSession(null);
      
      toast.info('Focus session ended');
    } catch (error) {
      console.error('Failed to stop focus session:', error);
      toast.error('Failed to stop focus session');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-surface-200 rounded w-1/3 mb-8"></div>
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded-lg"></div>
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
          <Button onClick={loadData} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {isInFocus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 focus-overlay z-50 flex items-center justify-center p-8"
          >
            <FocusTimer
              task={currentTask}
              duration={currentSession?.duration || 25}
              onComplete={completeFocusSession}
              onPause={pauseFocusSession}
              onStop={stopFocusSession}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-surface-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Focus Mode</h1>
              <p className="text-surface-600 mt-1">
                Deep work sessions with Pomodoro technique
              </p>
            </div>

            {/* Today's Stats */}
            {sessionStats && (
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {sessionStats.sessionsCompleted}
                  </div>
                  <div className="text-surface-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {Math.floor(sessionStats.totalMinutes / 60)}h {sessionStats.totalMinutes % 60}m
                  </div>
                  <div className="text-surface-600">Focus Time</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-xl font-semibold text-surface-900 mb-2">No tasks to focus on</h2>
                <p className="text-surface-600 mb-6 max-w-md">
                  Create some tasks first, then come back here to start focused work sessions.
                </p>
                <Button
                  onClick={() => toast.info('Use the AI chat to create tasks!')}
                  icon="MessageCircle"
                >
                  Create Tasks with AI
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-lg font-semibold text-surface-900 mb-6">
                Choose a task to focus on
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg border border-surface-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => startFocusSession(task)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-surface-600 line-clamp-3">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={task.priority} size="sm">
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-surface-500">
                      <div className="flex items-center gap-4">
                        {task.estimatedMinutes && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Clock" size={14} />
                            <span>{Math.round(task.estimatedMinutes / 60 * 10) / 10}h estimated</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Calendar" size={14} />
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <ApperIcon name="Target" size={16} className="text-primary" />
                    </div>

                    {/* Focus Session Options */}
                    <div className="mt-4 pt-4 border-t border-surface-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-700">Quick Start:</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              startFocusSession(task, 25);
                            }}
                          >
                            25 min
                          </Button>
                          <Button
                            size="sm"
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              startFocusSession(task, 50);
                            }}
                          >
                            50 min
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Focus Tips */}
              <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
                  <ApperIcon name="Lightbulb" size={20} className="text-primary" />
                  Focus Tips
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-surface-600">
                  <div className="flex items-start gap-3">
                    <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Remove distractions from your workspace</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Take breaks between focus sessions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Start with your most important task</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Stay hydrated and comfortable</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}