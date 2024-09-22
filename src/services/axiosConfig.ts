// services/axiosConfig.ts
import axios from 'axios';

const createApiInstance = (subFolder: string) => {
  return axios.create({
    baseURL: `http://localhost/back/${subFolder}`, 
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default createApiInstance;
