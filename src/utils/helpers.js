export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  return `${mins}m`;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'text-error bg-error/10 border-error/20';
    case 'high':
      return 'text-warning bg-warning/10 border-warning/20';
    case 'medium':
      return 'text-info bg-info/10 border-info/20';
    case 'low':
      return 'text-success bg-success/10 border-success/20';
    default:
      return 'text-surface-600 bg-surface-100 border-surface-200';
  }
};

export const getQuadrantInfo = (quadrant) => {
  const quadrants = {
    'urgent-important': {
      title: 'Do First',
      subtitle: 'Urgent & Important',
      color: 'border-error/30 bg-error/5',
      priority: 'urgent'
    },
    'not-urgent-important': {
      title: 'Schedule',
      subtitle: 'Important, Not Urgent',
      color: 'border-primary/30 bg-primary/5',
      priority: 'high'
    },
    'urgent-not-important': {
      title: 'Delegate',
      subtitle: 'Urgent, Not Important',
      color: 'border-warning/30 bg-warning/5',
      priority: 'medium'
    },
    'not-urgent-not-important': {
      title: 'Eliminate',
      subtitle: 'Neither Urgent nor Important',
      color: 'border-surface-300 bg-surface-50',
      priority: 'low'
    }
  };
  
  return quadrants[quadrant] || quadrants['not-urgent-important'];
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  // Check if it's in the past
  if (date < today) {
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays === 1 ? '' : 's'} overdue`;
  }
  
  // Future date
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }
  
  return date.toLocaleDateString();
};

export const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};