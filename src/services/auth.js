import axios from 'axios'
import api from './api'

const saveUserData = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const clearUserData = () => {
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

const getUserData = () => {
  try {
    const userData = localStorage.getItem('user')
    if (!userData) return null
    
    // Check if the data is valid JSON before parsing
    if (userData === 'undefined' || userData === 'null') {
      clearUserData() // Clear invalid data
      return null
    }
    
    const parsedData = JSON.parse(userData)
    return parsedData || null
  } catch (error) {
    console.error('Error getting user data:', error)
    // Clear potentially corrupted data
    clearUserData()
    return null
  }
}

const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials, {
      withCredentials: true, // Include cookies in the request
    });
    const { user } = response.data;

    // Save user data only (JWT is stored in HttpOnly cookie)
    saveUserData(user);

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.post('/auth/logout', {}, {
      withCredentials: true, // Include cookies in the request
    });
    clearUserData();
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    clearUserData(); // Clear data even if logout request fails
    throw error;
  }
};

const isAuthenticated = async () => {
  try {
    const user = getUserData();
    if (!user) return false;

    // Optionally, verify the session with the backend
    const response = await api.get('/auth/verify', {
      withCredentials: true, // Include cookies in the request
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default { 
  login, 
  logout, 
  getUserData, 
  isAuthenticated,
  saveUserData,
  clearUserData 
}