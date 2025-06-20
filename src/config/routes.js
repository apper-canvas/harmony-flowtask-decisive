import TasksPage from '@/components/pages/TasksPage';
import CalendarPage from '@/components/pages/CalendarPage';
import FocusPage from '@/components/pages/FocusPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import ProjectsPage from '@/components/pages/ProjectsPage';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/',
    icon: 'CheckSquare',
    component: TasksPage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  focus: {
    id: 'focus',
    label: 'Focus Mode',
    path: '/focus',
    icon: 'Target',
    component: FocusPage
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: AnalyticsPage
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
    component: ProjectsPage
  }
};

export const routeArray = Object.values(routes);
export default routes;