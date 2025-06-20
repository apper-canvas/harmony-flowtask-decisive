import { delay } from '@/utils/helpers';
import tasksData from '../mockData/tasks.json';
import { format, addDays, isToday, isTomorrow, isPast } from 'date-fns';

let tasks = [...tasksData];

// Helper function to get highest Id
const getNextId = () => {
  const maxId = Math.max(...tasks.map(task => task.Id), 0);
  return maxId + 1;
};

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async getByStatus(status) {
    await delay(250);
    return tasks.filter(t => t.status === status).map(t => ({ ...t }));
  },

  async getByPriority(priority) {
    await delay(250);
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  },

  async getByProject(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async getTodayTasks() {
    await delay(250);
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      return isToday(new Date(t.dueDate));
    }).map(t => ({ ...t }));
  },

  async getOverdueTasks() {
    await delay(250);
    return tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate));
    }).map(t => ({ ...t }));
  },

  async getTasksByQuadrant(quadrant) {
    await delay(250);
    return tasks.filter(t => t.quadrant === quadrant).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    
    const newTask = {
      Id: getNextId(),
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      quadrant: taskData.quadrant || 'not-urgent-important',
      status: 'pending',
      projectId: taskData.projectId || null,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: taskData.subtasks || [],
      attachments: taskData.attachments || [],
      assignedTo: taskData.assignedTo || [],
      estimatedMinutes: taskData.estimatedMinutes || null,
      actualMinutes: null
    };
    
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(350);
    
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      Id: tasks[taskIndex].Id, // Prevent Id modification
      updatedAt: new Date().toISOString(),
      completedAt: updates.status === 'completed' ? new Date().toISOString() : tasks[taskIndex].completedAt
    };
    
    tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    return { ...deletedTask };
  },

  async bulkUpdate(taskIds, updates) {
    await delay(500);
    
    const updatedTasks = [];
    taskIds.forEach(id => {
      const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          ...updates,
          Id: tasks[taskIndex].Id,
          updatedAt: new Date().toISOString()
        };
        tasks[taskIndex] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    });
    
    return updatedTasks;
  },

  async getProductivityStats() {
    await delay(400);
    
    const today = new Date();
    const completedToday = tasks.filter(t => 
      t.status === 'completed' && 
      t.completedAt && 
      isToday(new Date(t.completedAt))
    );
    
    const totalToday = tasks.filter(t => 
      t.dueDate && isToday(new Date(t.dueDate))
    );
    
    const overdue = tasks.filter(t => 
      t.dueDate && 
      isPast(new Date(t.dueDate)) && 
      !isToday(new Date(t.dueDate)) && 
      t.status !== 'completed'
    );
    
    return {
      completedToday: completedToday.length,
      totalToday: totalToday.length,
      completionRate: totalToday.length > 0 ? Math.round((completedToday.length / totalToday.length) * 100) : 0,
      overdue: overdue.length,
      totalFocusTime: completedToday.reduce((acc, task) => acc + (task.actualMinutes || 0), 0)
    };
  }
};

export default taskService;