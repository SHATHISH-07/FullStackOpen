import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials);
    return response.data; // Return user data if login is successful
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle invalid username or password
      throw new Error('Invalid username or password');
    } else {
      // Handle other types of errors
      throw new Error('An error occurred while logging in');
    }
  }
};

export default { login };
