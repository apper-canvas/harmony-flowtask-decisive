import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/atoms/ProgressRing';
import Badge from '@/components/atoms/Badge';
import { taskService, focusSessionService } from '@/services';
import { calculateCompletionRate, formatDuration } from '@/utils/helpers';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('today'); // 'today', 'week', 'month'

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
const [statsData, tasksData, focusStats] = await Promise.all([
        taskService.getProductivityStats(),
        taskService.getAll(),
        focusSessionService.getTodayStats()
      ]);
      
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
      
      setStats({
        ...statsData,
        ...focusStats
      });
      setTasks(mappedTasks);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getTasksByPriority = () => {
    const priorities = { urgent: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach(task => {
      if (priorities.hasOwnProperty(task.priority)) {
        priorities[task.priority]++;
      }
    });
    return priorities;
  };

  const getTasksByStatus = () => {
    const statuses = { pending: 0, 'in-progress': 0, completed: 0 };
    tasks.forEach(task => {
      if (statuses.hasOwnProperty(task.status)) {
        statuses[task.status]++;
      }
    });
    return statuses;
  };

  const getOverdueTasksCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
  };

  const priorityData = getTasksByPriority();
  const statusData = getTasksByStatus();
  const overdueCount = getOverdueTasksCount();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-surface-200 rounded-lg"></div>
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
          <Button onClick={loadAnalytics} icon="RefreshCw">
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
            <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
            <p className="text-surface-600 mt-1">
              Track your productivity and task completion patterns
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setTimeRange('today')}
              variant={timeRange === 'today' ? 'primary' : 'outline'}
              size="sm"
            >
              Today
            </Button>
            <Button
              onClick={() => setTimeRange('week')}
              variant={timeRange === 'week' ? 'primary' : 'outline'}
              size="sm"
            >
              This Week
            </Button>
            <Button
              onClick={() => setTimeRange('month')}
              variant={timeRange === 'month' ? 'primary' : 'outline'}
              size="sm"
            >
              This Month
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-success">
                  {stats?.completedToday || 0}
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  of {stats?.totalToday || 0} scheduled
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-full">
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Completion Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {stats?.completionRate || 0}%
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  {stats?.completionRate >= 70 ? 'Great progress!' : 'Keep going!'}
                </p>
              </div>
              <ProgressRing
                progress={stats?.completionRate || 0}
                size={48}
                color="#4F46E5"
                showPercentage={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Focus Time</p>
                <p className="text-2xl font-bold text-secondary">
                  {formatDuration(stats?.totalFocusTime || 0)}
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  {stats?.sessionsCompleted || 0} sessions completed
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <ApperIcon name="Target" size={24} className="text-secondary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-error">
                  {overdueCount}
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  {overdueCount === 0 ? 'All caught up!' : 'Need attention'}
                </p>
              </div>
              <div className="p-3 bg-error/10 rounded-full">
                <ApperIcon name="AlertTriangle" size={24} className="text-error" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-6">Task Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-surface-400 rounded-full"></div>
                  <span className="text-sm text-surface-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{statusData.pending}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-surface-400 h-2 rounded-full" 
                      style={{ width: `${(statusData.pending / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-sm text-surface-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{statusData['in-progress']}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full" 
                      style={{ width: `${(statusData['in-progress'] / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-surface-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{statusData.completed}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ width: `${(statusData.completed / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg border border-surface-200 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-6">Priority Distribution</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-sm text-surface-600">Urgent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{priorityData.urgent}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-error h-2 rounded-full" 
                      style={{ width: `${(priorityData.urgent / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-sm text-surface-600">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{priorityData.high}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full" 
                      style={{ width: `${(priorityData.high / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-info rounded-full"></div>
                  <span className="text-sm text-surface-600">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{priorityData.medium}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-info h-2 rounded-full" 
                      style={{ width: `${(priorityData.medium / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-surface-600">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{priorityData.low}</span>
                  <div className="w-16 bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ width: `${(priorityData.low / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg border border-surface-200 p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-6">Productivity Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <ApperIcon name="TrendingUp" size={32} className="text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-surface-900 mb-1">Most Productive</h4>
                <p className="text-sm text-surface-600">
                  You complete most tasks in the morning
                </p>
              </div>

              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <ApperIcon name="Clock" size={32} className="text-secondary mx-auto mb-2" />
                <h4 className="font-semibold text-surface-900 mb-1">Average Session</h4>
                <p className="text-sm text-surface-600">
                  {stats?.averageSessionLength || 25} minutes focus time
                </p>
              </div>

              <div className="text-center p-4 bg-success/5 rounded-lg">
                <ApperIcon name="Award" size={32} className="text-success mx-auto mb-2" />
                <h4 className="font-semibold text-surface-900 mb-1">Streak</h4>
                <p className="text-sm text-surface-600">
                  3 days of completing daily goals
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}