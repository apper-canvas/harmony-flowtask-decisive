import { toast } from 'react-toastify';

const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "quadrant" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "subtasks" } },
          { field: { Name: "attachments" } },
          { field: { Name: "estimated_minutes" } },
          { field: { Name: "actual_minutes" } },
          { field: { Name: "project_id" } },
          { field: { Name: "assigned_to" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
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
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "quadrant" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "subtasks" } },
          { field: { Name: "attachments" } },
          { field: { Name: "estimated_minutes" } },
          { field: { Name: "actual_minutes" } },
          { field: { Name: "project_id" } },
          { field: { Name: "assigned_to" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async getByStatus(status) {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "quadrant" } },
          { field: { Name: "status" } },
          { field: { Name: "estimated_minutes" } },
          { field: { Name: "actual_minutes" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const recordData = {
        Name: taskData.title || taskData.Name || '',
        title: taskData.title || '',
        description: taskData.description || '',
        due_date: taskData.dueDate || taskData.due_date || null,
        priority: taskData.priority || 'medium',
        quadrant: taskData.quadrant || 'not-urgent-important',
        status: taskData.status || 'pending',
        Tags: taskData.tags ? taskData.tags.join(',') : '',
        estimated_minutes: taskData.estimatedMinutes || taskData.estimated_minutes || null,
        actual_minutes: taskData.actualMinutes || taskData.actual_minutes || null,
        project_id: taskData.projectId || taskData.project_id || null,
        assigned_to: taskData.assignedTo || taskData.assigned_to || null,
        subtasks: taskData.subtasks ? (Array.isArray(taskData.subtasks) ? taskData.subtasks.join('\n') : taskData.subtasks) : '',
        attachments: taskData.attachments ? (Array.isArray(taskData.attachments) ? taskData.attachments.join(',') : taskData.attachments) : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('task', params);
      
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
          toast.success('Task created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
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
        Id: parseInt(id, 10),
        updated_at: new Date().toISOString()
      };
      
      // Map frontend field names to database field names
      if (updates.title !== undefined) recordData.title = updates.title;
      if (updates.Name !== undefined) recordData.Name = updates.Name;
      if (updates.description !== undefined) recordData.description = updates.description;
      if (updates.dueDate !== undefined) recordData.due_date = updates.dueDate;
      if (updates.due_date !== undefined) recordData.due_date = updates.due_date;
      if (updates.priority !== undefined) recordData.priority = updates.priority;
      if (updates.quadrant !== undefined) recordData.quadrant = updates.quadrant;
      if (updates.status !== undefined) {
        recordData.status = updates.status;
        if (updates.status === 'completed') {
          recordData.completed_at = new Date().toISOString();
        }
      }
      if (updates.tags !== undefined) recordData.Tags = Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags;
      if (updates.estimatedMinutes !== undefined) recordData.estimated_minutes = updates.estimatedMinutes;
      if (updates.estimated_minutes !== undefined) recordData.estimated_minutes = updates.estimated_minutes;
      if (updates.actualMinutes !== undefined) recordData.actual_minutes = updates.actualMinutes;
      if (updates.actual_minutes !== undefined) recordData.actual_minutes = updates.actual_minutes;
      if (updates.projectId !== undefined) recordData.project_id = updates.projectId;
      if (updates.project_id !== undefined) recordData.project_id = updates.project_id;
      if (updates.assignedTo !== undefined) recordData.assigned_to = updates.assignedTo;
      if (updates.assigned_to !== undefined) recordData.assigned_to = updates.assigned_to;
      if (updates.subtasks !== undefined) recordData.subtasks = Array.isArray(updates.subtasks) ? updates.subtasks.join('\n') : updates.subtasks;
      if (updates.attachments !== undefined) recordData.attachments = Array.isArray(updates.attachments) ? updates.attachments.join(',') : updates.attachments;
      if (updates.completedAt !== undefined) recordData.completed_at = updates.completedAt;
      if (updates.completed_at !== undefined) recordData.completed_at = updates.completed_at;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
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
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      throw error;
    }
  },

  async getProductivityStats() {
    try {
      const tasks = await this.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completedToday = tasks.filter(t => 
        t.status === 'completed' && 
        t.completed_at && 
        new Date(t.completed_at).toDateString() === today.toDateString()
      );
      
      const totalToday = tasks.filter(t => 
        t.due_date && new Date(t.due_date).toDateString() === today.toDateString()
      );
      
      const overdue = tasks.filter(t => 
        t.due_date && 
        new Date(t.due_date) < today && 
        t.status !== 'completed'
      );
      
      return {
        completedToday: completedToday.length,
        totalToday: totalToday.length,
        completionRate: totalToday.length > 0 ? Math.round((completedToday.length / totalToday.length) * 100) : 0,
        overdue: overdue.length,
        totalFocusTime: completedToday.reduce((acc, task) => acc + (parseInt(task.actual_minutes) || 0), 0)
      };
    } catch (error) {
      console.error("Error getting productivity stats:", error);
      return {
        completedToday: 0,
        totalToday: 0,
        completionRate: 0,
        overdue: 0,
        totalFocusTime: 0
      };
    }
  }
};

export default taskService;