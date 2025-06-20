import { delay } from '@/utils/helpers';
import focusSessionsData from '../mockData/focusSessions.json';

let focusSessions = [...focusSessionsData];

const getNextId = () => {
  const maxId = Math.max(...focusSessions.map(session => session.Id), 0);
  return maxId + 1;
};

const focusSessionService = {
  async getAll() {
    await delay(300);
    return [...focusSessions];
  },

  async getById(id) {
    await delay(200);
    const session = focusSessions.find(s => s.Id === parseInt(id, 10));
    return session ? { ...session } : null;
  },

  async getByTaskId(taskId) {
    await delay(250);
    return focusSessions.filter(s => s.taskId === taskId).map(s => ({ ...s }));
  },

  async create(sessionData) {
    await delay(400);
    
    const newSession = {
      Id: getNextId(),
      taskId: sessionData.taskId || null,
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: sessionData.endTime || null,
      duration: sessionData.duration || 25,
      type: sessionData.type || 'pomodoro',
      completed: sessionData.completed || false
    };
    
    focusSessions.push(newSession);
    return { ...newSession };
  },

  async update(id, updates) {
    await delay(350);
    
    const sessionIndex = focusSessions.findIndex(s => s.Id === parseInt(id, 10));
    if (sessionIndex === -1) {
      throw new Error('Focus session not found');
    }
    
    const updatedSession = {
      ...focusSessions[sessionIndex],
      ...updates,
      Id: focusSessions[sessionIndex].Id
    };
    
    focusSessions[sessionIndex] = updatedSession;
    return { ...updatedSession };
  },

  async complete(id) {
    await delay(300);
    
    const sessionIndex = focusSessions.findIndex(s => s.Id === parseInt(id, 10));
    if (sessionIndex === -1) {
      throw new Error('Focus session not found');
    }
    
    const completedSession = {
      ...focusSessions[sessionIndex],
      completed: true,
      endTime: new Date().toISOString()
    };
    
    focusSessions[sessionIndex] = completedSession;
    return { ...completedSession };
  },

  async getTodayStats() {
    await delay(250);
    
    const today = new Date().toDateString();
    const todaySessions = focusSessions.filter(s => 
      s.completed && new Date(s.startTime).toDateString() === today
    );
    
    const totalMinutes = todaySessions.reduce((acc, session) => {
      if (session.endTime) {
        const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
        return acc + duration;
      }
      return acc;
    }, 0);
    
    return {
      sessionsCompleted: todaySessions.length,
      totalMinutes: Math.round(totalMinutes),
      averageSessionLength: todaySessions.length > 0 ? Math.round(totalMinutes / todaySessions.length) : 0
    };
  }
};

export default focusSessionService;