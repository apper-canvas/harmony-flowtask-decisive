import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { projectService, taskService } from '@/services';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed');
    const completionRate = projectTasks.length > 0 
      ? Math.round((completedTasks.length / projectTasks.length) * 100) 
      : 0;

    return {
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      overdueCount: projectTasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < new Date();
      }).length
    };
  };

  const handleCreateProject = () => {
    toast.info('Project creation coming soon!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-surface-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-surface-200 rounded-lg"></div>
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-surface-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
            <p className="text-surface-600 mt-1">
              Organize your tasks into meaningful projects
            </p>
          </div>

          <Button onClick={handleCreateProject} icon="Plus">
            New Project
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="text-xl font-semibold text-surface-900 mb-2">No projects yet</h2>
              <p className="text-surface-600 mb-6 max-w-md">
                Create your first project to organize your tasks and collaborate with others.
              </p>
              <Button onClick={handleCreateProject} icon="FolderPlus">
                Create First Project
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => {
              const stats = getProjectStats(project.Id);
              
              return (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, shadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-lg border border-surface-200 p-6 cursor-pointer transition-all hover:border-primary/30"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: project.color }}
                      >
                        <ApperIcon name={project.icon} size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-surface-900 truncate">
                          {project.name}
                        </h3>
                        {project.isShared && (
                          <Badge variant="info" size="xs" className="mt-1">
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <button className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors">
                      <ApperIcon name="MoreVertical" size={16} />
                    </button>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-surface-700">Progress</span>
                      <span className="text-sm text-surface-600">
                        {stats.completedTasks}/{stats.totalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.completionRate}%`,
                          backgroundColor: project.color 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-surface-900">{stats.completionRate}%</div>
                        <div className="text-surface-500">Complete</div>
                      </div>
                      
                      {stats.overdueCount > 0 && (
                        <div className="text-center">
                          <div className="font-semibold text-error">{stats.overdueCount}</div>
                          <div className="text-surface-500">Overdue</div>
                        </div>
                      )}
                    </div>

                    {/* Members */}
                    {project.isShared && project.members.length > 0 && (
                      <div className="flex items-center -space-x-2">
                        {project.members.slice(0, 3).map((member, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                          >
                            {member.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="w-6 h-6 bg-surface-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-surface-600">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-surface-200">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedProject.color }}
                >
                  <ApperIcon name={selectedProject.icon} size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-surface-900">
                    {selectedProject.name}
                  </h2>
                  <p className="text-surface-600 mt-1">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Project Stats */}
                {(() => {
                  const stats = getProjectStats(selectedProject.Id);
                  return (
                    <>
                      <div className="text-center p-4 bg-success/5 rounded-lg">
                        <div className="text-2xl font-bold text-success mb-1">
                          {stats.completedTasks}
                        </div>
                        <div className="text-sm text-surface-600">Completed</div>
                      </div>
                      
                      <div className="text-center p-4 bg-warning/5 rounded-lg">
                        <div className="text-2xl font-bold text-warning mb-1">
                          {stats.totalTasks - stats.completedTasks}
                        </div>
                        <div className="text-sm text-surface-600">Remaining</div>
                      </div>
                      
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {stats.completionRate}%
                        </div>
                        <div className="text-sm text-surface-600">Complete</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Project Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Tasks</h3>
                <div className="space-y-3">
                  {tasks
                    .filter(task => task.projectId === selectedProject.Id)
                    .slice(0, 5)
                    .map((task) => (
                      <div key={task.Id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-success' : 
                          task.status === 'in-progress' ? 'bg-warning' : 'bg-surface-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                            {task.title}
                          </p>
                        </div>
                        <Badge variant={task.priority} size="xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 p-6 border-t border-surface-200">
              <Button onClick={() => setSelectedProject(null)} variant="outline">
                Close
              </Button>
              <Button 
                onClick={() => {
                  toast.info('Project editing coming soon!');
                  setSelectedProject(null);
                }}
                icon="Edit2"
              >
                Edit Project
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}