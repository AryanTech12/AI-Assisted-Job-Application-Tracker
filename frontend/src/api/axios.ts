import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-assisted-job-application-tracker-6ugy.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('jobTrackerUser');
  if (user) {
    const { token } = JSON.parse(user);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
