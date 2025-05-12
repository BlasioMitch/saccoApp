import api from './api'

const saveUserData = (userData, token) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('token', token)
    }
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const clearUserData = () => {
  try {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
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
    const { user, token } = response.data;

    // Save both user data and token
    saveUserData(user, token);

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