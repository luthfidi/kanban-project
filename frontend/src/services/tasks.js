import api from '../utils/axios';

export const getTasks = async () => {
  const response = await api.get('/api/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/api/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/api/tasks/${taskId}`);
};