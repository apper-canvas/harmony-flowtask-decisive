import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import QuickAddTask from '@/components/molecules/QuickAddTask';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import EisenhowerMatrix from '@/components/organisms/EisenhowerMatrix';
import { taskService, projectService } from '@/services';

// Task Edit Modal Component
const TaskEditModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    quadrant: 'not-urgent-important',
    status: 'pending',
    Tags: '',
    estimated_minutes: '',
    project_id: '',
    assigned_to: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date || task.dueDate || '',
        priority: task.priority || 'medium',
        quadrant: task.quadrant || 'not-urgent-important',
        status: task.status || 'pending',
        Tags: task.Tags || (task.tags ? task.tags.join(',') : ''),
        estimated_minutes: task.estimated_minutes || task.estimatedMinutes || '',
        project_id: task.project_id || task.projectId || '',
        assigned_to: task.assigned_to || task.assignedTo || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setLoading(true);
    try {
      const updatedTask = await onSave(task.Id, formData);
      if (updatedTask) {
        toast.success('Task updated successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-surface-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={formData.estimated_minutes}
                onChange={(e) => setFormData({ ...formData, estimated_minutes: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="60"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Quadrant
              </label>
              <select
                value={formData.quadrant}
                onChange={(e) => setFormData({ ...formData, quadrant: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="urgent-important">Urgent & Important</option>
                <option value="not-urgent-important">Not Urgent & Important</option>
                <option value="urgent-not-important">Urgent & Not Important</option>
                <option value="not-urgent-not-important">Not Urgent & Not Important</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.Tags}
                onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tag1,tag2,tag3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'matrix'
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      // Map database fields to frontend format
      const mappedTasks = (tasksData || []).map(task => ({
        ...task,
        title: task.title || task.Name,
        dueDate: task.due_date,
        projectId: task.project_id,
        tags: task.Tags ? task.Tags.split(',').filter(tag => tag.trim()) : [],
        estimatedMinutes: parseInt(task.estimated_minutes) || null,
        actualMinutes: parseInt(task.actual_minutes) || null,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        completedAt: task.completed_at,
        assignedTo: task.assigned_to,
        subtasks: task.subtasks ? task.subtasks.split('\n').filter(sub => sub.trim()) : []
      }));
      
      const mappedProjects = (projectsData || []).map(project => ({
        ...project,
        name: project.Name || project.name,
        isShared: project.is_shared,
        createdAt: project.created_at
      }));
      
      setTasks(mappedTasks);
      setProjects(mappedProjects);
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

const handleTaskAdd = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      if (newTask) {
        // Map the response to match frontend format
        const mappedTask = {
          ...newTask,
          title: newTask.title || newTask.Name,
          dueDate: newTask.due_date,
          projectId: newTask.project_id,
          tags: newTask.Tags ? newTask.Tags.split(',').filter(tag => tag.trim()) : [],
          estimatedMinutes: parseInt(newTask.estimated_minutes) || null,
          actualMinutes: parseInt(newTask.actual_minutes) || null,
          createdAt: newTask.created_at,
          updatedAt: newTask.updated_at,
          completedAt: newTask.completed_at,
          assignedTo: newTask.assigned_to,
          subtasks: newTask.subtasks ? newTask.subtasks.split('\n').filter(sub => sub.trim()) : []
        };
        
        setTasks(prev => [mappedTask, ...prev]);
        toast.success('Task created successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
      return false;
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      
      if (updatedTask) {
        // Map the response to match frontend format
        const mappedTask = {
          ...updatedTask,
          title: updatedTask.title || updatedTask.Name,
          dueDate: updatedTask.due_date,
          projectId: updatedTask.project_id,
          tags: updatedTask.Tags ? updatedTask.Tags.split(',').filter(tag => tag.trim()) : [],
          estimatedMinutes: parseInt(updatedTask.estimated_minutes) || null,
          actualMinutes: parseInt(updatedTask.actual_minutes) || null,
          createdAt: updatedTask.created_at,
          updatedAt: updatedTask.updated_at,
          completedAt: updatedTask.completed_at,
          assignedTo: updatedTask.assigned_to,
          subtasks: updatedTask.subtasks ? updatedTask.subtasks.split('\n').filter(sub => sub.trim()) : []
        };
        
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? mappedTask : task
        ));
        
        return mappedTask;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
      throw error;
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
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleModalSave = async (taskId, updates) => {
    return await handleTaskUpdate(taskId, updates);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
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
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                icon="Plus"
                variant={showQuickAdd ? 'primary' : 'outline'}
              >
                Add Task
              </Button>
            </div>
          </div>
</div>

        {/* Quick Add Task */}
        {showQuickAdd && (
          <div className="flex-shrink-0 px-6 py-4 border-b border-surface-200 bg-surface-50">
            <QuickAddTask onAdd={handleTaskAdd} />
          </div>
        )}

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

      {/* Task Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleModalSave}
      />
    </div>
  );
}