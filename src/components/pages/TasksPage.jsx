import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import EisenhowerMatrix from '@/components/organisms/EisenhowerMatrix';
import { taskService, projectService } from '@/services';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'matrix'
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
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

  const handleTaskComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      toast.success('Task completed! 🎉');
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast.error('Failed to complete task');
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskEdit = (task) => {
    // For now, just show a simple alert - in a real app you'd open an edit modal
    toast.info('Edit functionality coming soon!');
  };

  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.projectId && task.projectId !== filters.projectId) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      return true;
    });
  };

  const filteredTasks = filterTasks(tasks);
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  const pendingTasks = filteredTasks.filter(task => task.status !== 'completed');

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-surface-200 rounded w-1/3 mb-8"></div>
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
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
    <div className="h-full flex">
      {/* Filter Sidebar */}
      {showFilters && (
        <FilterSidebar
          projects={projects}
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-surface-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Tasks</h1>
              <p className="text-surface-600 mt-1">
                {pendingTasks.length} pending, {completedTasks.length} completed
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
                  }`}
                >
                  <ApperIcon name="List" size={16} className="mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('matrix')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'matrix' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
                  }`}
                >
                  <ApperIcon name="Grid3x3" size={16} className="mr-2" />
                  Matrix
                </button>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'primary' : 'outline'}
                icon="Filter"
              >
                Filters
              </Button>

              {/* Add Task Button */}
              <Button
                onClick={() => toast.info('Use the AI chat to create tasks!')}
                icon="Plus"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-semibold text-surface-900 mb-2">
                  {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                </h2>
                <p className="text-surface-600 mb-6 max-w-md">
                  {tasks.length === 0 
                    ? "Get started by creating your first task using the AI assistant"
                    : "Try adjusting your filters or search terms"
                  }
                </p>
                <Button
                  onClick={() => toast.info('Click the AI chat button to create your first task!')}
                  icon="MessageCircle"
                >
                  Chat with AI Assistant
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskCard
                        task={task}
                        onComplete={handleTaskComplete}
                        onEdit={handleTaskEdit}
                        onDelete={handleTaskDelete}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EisenhowerMatrix
                  tasks={filteredTasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskComplete={handleTaskComplete}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}