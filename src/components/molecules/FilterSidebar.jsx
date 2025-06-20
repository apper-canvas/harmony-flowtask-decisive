import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

export default function FilterSidebar({ 
  projects = [], 
  filters = {}, 
  onFilterChange,
  className = '' 
}) {
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [key]: value });
    }
  };

  const priorities = [
    { value: 'urgent', label: 'Urgent', icon: 'AlertTriangle', color: 'error' },
    { value: 'high', label: 'High', icon: 'ArrowUp', color: 'warning' },
    { value: 'medium', label: 'Medium', icon: 'Minus', color: 'info' },
    { value: 'low', label: 'Low', icon: 'ArrowDown', color: 'success' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', icon: 'Circle' },
    { value: 'in-progress', label: 'In Progress', icon: 'Play' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`w-64 bg-white border-r border-surface-200 p-4 overflow-y-auto ${className}`}
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <ApperIcon name="Search" size={16} className="absolute left-3 top-3 text-surface-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Folder" size={16} />
          Projects
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange('projectId', null)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              !filters.projectId ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            <ApperIcon name="Inbox" size={16} />
            All Projects
          </button>
          {projects.map((project) => (
            <button
              key={project.Id}
              onClick={() => handleFilterChange('projectId', project.Id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                filters.projectId === project.Id ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              <ApperIcon name={project.icon} size={16} />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Flag" size={16} />
          Priority
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange('priority', null)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              !filters.priority ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            <ApperIcon name="List" size={16} />
            All Priorities
          </button>
          {priorities.map((priority) => (
            <button
              key={priority.value}
              onClick={() => handleFilterChange('priority', priority.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                filters.priority === priority.value ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={priority.icon} size={16} />
                {priority.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
          <ApperIcon name="Activity" size={16} />
          Status
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange('status', null)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              !filters.status ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
            }`}
          >
            <ApperIcon name="List" size={16} />
            All Statuses
          </button>
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleFilterChange('status', status.value)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                filters.status === status.value ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              <ApperIcon name={status.icon} size={16} />
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.search || filters.projectId || filters.priority || filters.status) && (
        <button
          onClick={() => onFilterChange?.({})}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
        >
          <ApperIcon name="X" size={16} />
          Clear Filters
        </button>
      )}
    </motion.div>
  );
}