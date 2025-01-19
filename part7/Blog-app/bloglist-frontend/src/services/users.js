import axios from 'axios';

const baseUrl = '/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (userData) => {
  const response = await axios.post(baseUrl, userData); // Send user data to backend
  return response.data; // Return the created user data
};

export default { getAll, create }; // Make sure create is exported
