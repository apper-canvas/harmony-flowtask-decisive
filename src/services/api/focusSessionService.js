import { toast } from 'react-toastify';

const focusSessionService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "duration" } },
          { field: { Name: "type" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('focus_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching focus sessions:", error);
      toast.error("Failed to fetch focus sessions");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "duration" } },
          { field: { Name: "type" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById('focus_session', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching focus session with ID ${id}:`, error);
      return null;
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "duration" } },
          { field: { Name: "type" } },
          { field: { Name: "completed" } },
          { field: { Name: "task_id" } }
        ],
        where: [
          {
            FieldName: "task_id",
            Operator: "EqualTo",
            Values: [parseInt(taskId, 10)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('focus_session', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching focus sessions by task ID:", error);
      return [];
    }
  },

  async create(sessionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const recordData = {
        Name: `Focus Session ${new Date().toISOString()}`,
        task_id: sessionData.taskId ? parseInt(sessionData.taskId, 10) : null,
        start_time: sessionData.startTime || new Date().toISOString(),
        end_time: sessionData.endTime || null,
        duration: sessionData.duration || 25,
        type: sessionData.type || 'pomodoro',
        completed: sessionData.completed || false,
        Tags: sessionData.tags ? (Array.isArray(sessionData.tags) ? sessionData.tags.join(',') : sessionData.tags) : ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('focus_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating focus session:", error);
      toast.error("Failed to create focus session");
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const recordData = {
        Id: parseInt(id, 10)
      };
      
      // Map frontend field names to database field names
      if (updates.taskId !== undefined) recordData.task_id = parseInt(updates.taskId, 10);
      if (updates.task_id !== undefined) recordData.task_id = parseInt(updates.task_id, 10);
      if (updates.startTime !== undefined) recordData.start_time = updates.startTime;
      if (updates.start_time !== undefined) recordData.start_time = updates.start_time;
      if (updates.endTime !== undefined) recordData.end_time = updates.endTime;
      if (updates.end_time !== undefined) recordData.end_time = updates.end_time;
      if (updates.duration !== undefined) recordData.duration = updates.duration;
      if (updates.type !== undefined) recordData.type = updates.type;
      if (updates.completed !== undefined) recordData.completed = updates.completed;
      if (updates.tags !== undefined) recordData.Tags = Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('focus_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating focus session:", error);
      toast.error("Failed to update focus session");
      throw error;
    }
  },

  async complete(id) {
    try {
      return await this.update(id, {
        completed: true,
        end_time: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error completing focus session:", error);
      throw error;
    }
  },

  async getTodayStats() {
    try {
      const sessions = await this.getAll();
      const today = new Date().toDateString();
      
      const todaySessions = sessions.filter(s => 
        s.completed && s.start_time && new Date(s.start_time).toDateString() === today
      );
      
      const totalMinutes = todaySessions.reduce((acc, session) => {
        if (session.end_time && session.start_time) {
          const duration = (new Date(session.end_time) - new Date(session.start_time)) / (1000 * 60);
          return acc + duration;
        }
        return acc + (parseInt(session.duration) || 0);
      }, 0);
      
      return {
        sessionsCompleted: todaySessions.length,
        totalMinutes: Math.round(totalMinutes),
        averageSessionLength: todaySessions.length > 0 ? Math.round(totalMinutes / todaySessions.length) : 0
      };
    } catch (error) {
      console.error("Error getting today's stats:", error);
      return {
        sessionsCompleted: 0,
        totalMinutes: 0,
        averageSessionLength: 0
      };
    }
  }
};

export default focusSessionService;