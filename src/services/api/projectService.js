import { delay } from '@/utils/helpers';
import projectsData from '../mockData/projects.json';

let projects = [...projectsData];

const getNextId = () => {
  const maxId = Math.max(...projects.map(project => project.Id), 0);
  return maxId + 1;
};

const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id, 10));
    return project ? { ...project } : null;
  },

  async create(projectData) {
    await delay(400);
    
    const newProject = {
      Id: getNextId(),
      name: projectData.name || '',
      color: projectData.color || '#4F46E5',
      icon: projectData.icon || 'Folder',
      description: projectData.description || '',
      isShared: projectData.isShared || false,
      members: projectData.members || [],
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updates) {
    await delay(350);
    
    const projectIndex = projects.findIndex(p => p.Id === parseInt(id, 10));
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      Id: projects[projectIndex].Id
    };
    
    projects[projectIndex] = updatedProject;
    return { ...updatedProject };
  },

  async delete(id) {
    await delay(300);
    
    const projectIndex = projects.findIndex(p => p.Id === parseInt(id, 10));
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    const deletedProject = projects[projectIndex];
    projects.splice(projectIndex, 1);
    return { ...deletedProject };
  }
};

export default projectService;