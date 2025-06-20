import { delay } from '@/utils/helpers';
import { format, addDays, addWeeks, startOfDay, endOfDay } from 'date-fns';

// Mock AI conversation data
let conversations = [];
let currentConversationId = 1;

const aiService = {
  async processMessage(message) {
    await delay(800); // Simulate AI processing time
    
    const response = await this.generateResponse(message);
    const extractedData = this.extractTaskData(message);
    
    return {
      response,
      extractedData,
      suggestions: this.generateSuggestions(message, extractedData)
    };
  },

  async generateResponse(message) {
    const lowercaseMessage = message.toLowerCase();
    
    // Task creation responses
    if (lowercaseMessage.includes('create') || lowercaseMessage.includes('add') || lowercaseMessage.includes('new task')) {
      return "I'll help you create that task! I've extracted the details from your message. Please review and confirm the task details.";
    }
    
    // Priority/scheduling responses
    if (lowercaseMessage.includes('urgent') || lowercaseMessage.includes('asap')) {
      return "I understand this is urgent. I'll set this as high priority and suggest scheduling it in your next available time slot.";
    }
    
    // Time-based responses
    if (lowercaseMessage.includes('today') || lowercaseMessage.includes('tonight')) {
      return "Got it! I'll schedule this for today. Based on your current workload, I recommend focusing on this during your most productive hours.";
    }
    
    if (lowercaseMessage.includes('tomorrow')) {
      return "Perfect! I'll add this to tomorrow's schedule. Would you like me to suggest an optimal time based on your calendar?";
    }
    
    // General helpful response
    return "I understand! Let me help you organize this task. I've analyzed your message and extracted the key information.";
  },

  extractTaskData(message) {
    const extractedData = {
      title: '',
      priority: 'medium',
      dueDate: null,
      tags: [],
      projectHint: null,
      estimatedMinutes: null
    };
    
    // Extract title (simple approach - take the main part after common task words)
    let title = message;
    const taskWords = ['create', 'add', 'new task', 'remind me to', 'i need to', 'todo'];
    taskWords.forEach(word => {
      if (title.toLowerCase().includes(word)) {
        title = title.toLowerCase().replace(word, '').trim();
      }
    });
    
    // Clean up title
    title = title.replace(/^(a |an |the )/i, '').trim();
    extractedData.title = title.charAt(0).toUpperCase() + title.slice(1);
    
    // Extract priority
    if (message.toLowerCase().includes('urgent') || message.toLowerCase().includes('asap') || message.toLowerCase().includes('important')) {
      extractedData.priority = 'high';
    } else if (message.toLowerCase().includes('low priority') || message.toLowerCase().includes('when i have time')) {
      extractedData.priority = 'low';
    }
    
    // Extract due dates
    const today = new Date();
    if (message.toLowerCase().includes('today') || message.toLowerCase().includes('tonight')) {
      extractedData.dueDate = format(today, 'yyyy-MM-dd');
    } else if (message.toLowerCase().includes('tomorrow')) {
      extractedData.dueDate = format(addDays(today, 1), 'yyyy-MM-dd');
    } else if (message.toLowerCase().includes('next week')) {
      extractedData.dueDate = format(addWeeks(today, 1), 'yyyy-MM-dd');
    }
    
    // Extract time estimates
    const timeRegex = /(\d+)\s*(hour|hr|minute|min)/gi;
    const timeMatches = message.match(timeRegex);
    if (timeMatches) {
      let totalMinutes = 0;
      timeMatches.forEach(match => {
        const number = parseInt(match.match(/\d+/)[0]);
        if (match.toLowerCase().includes('hour') || match.toLowerCase().includes('hr')) {
          totalMinutes += number * 60;
        } else {
          totalMinutes += number;
        }
      });
      extractedData.estimatedMinutes = totalMinutes;
    }
    
    // Extract project hints
    const projectKeywords = ['work', 'personal', 'home', 'project', 'client'];
    projectKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        extractedData.projectHint = keyword;
      }
    });
    
    // Extract tags from common patterns
    const commonTags = ['meeting', 'call', 'email', 'review', 'presentation', 'research', 'planning'];
    commonTags.forEach(tag => {
      if (message.toLowerCase().includes(tag)) {
        extractedData.tags.push(tag);
      }
    });
    
    return extractedData;
  },

  generateSuggestions(message, extractedData) {
    const suggestions = [];
    
    // Priority suggestions
    if (extractedData.priority === 'medium') {
      suggestions.push({
        type: 'priority',
        text: 'Would you like to set this as high priority?',
        action: 'setPriority',
        value: 'high'
      });
    }
    
    // Time suggestions
    if (!extractedData.dueDate) {
      suggestions.push({
        type: 'schedule',
        text: 'When would you like to complete this?',
        action: 'setDueDate',
        options: ['Today', 'Tomorrow', 'This week']
      });
    }
    
    // Focus session suggestion
    if (extractedData.estimatedMinutes && extractedData.estimatedMinutes <= 60) {
      suggestions.push({
        type: 'focus',
        text: 'Start a focus session for this task?',
        action: 'startFocus',
        value: extractedData.estimatedMinutes
      });
    }
    
    return suggestions;
  },

  async saveConversation(messages) {
    await delay(200);
    
    const conversation = {
      Id: currentConversationId++,
      messages,
      context: {},
      createdAt: new Date().toISOString()
    };
    
    conversations.push(conversation);
    return { ...conversation };
  },

  async getConversationHistory() {
    await delay(300);
    return [...conversations];
  }
};

export default aiService;