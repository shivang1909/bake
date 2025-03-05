import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/add`, userData,{withCredentials:true});
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Check if error is related to email already existing
      const errorMessage = error.response.data.message || 'An error occurred';
      console.error('Error creating user:', errorMessage);
      throw new Error(errorMessage);  // Throw the error message to be handled in the component
    } else {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};


// Fetch all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/list`,{withCredentials:true});
    console.log(response.data);
    
    return response.data; // Return the list of users
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};


// Set password with additional response handling
export const setPassword = async (userId, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/set-password/${userId}`,
      { password }
    );

    if (response.data.message === 'Password is already set for this user.') {
      return { alreadySet: true, message: response.data.message };
    }

    return { alreadySet: false, message: response.data.message };
  } catch (error) {
    console.error('Error setting password:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Verify OTP
export const verifyOtp = async (otpData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-otp`, otpData);
    return response.data; // Expecting { message, token }
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};


// Send password reset link
export const sendPasswordResetLink = async (email) => {
  const url = `${API_URL}/api/users/forgot-password`;
  try {
    const response = await axios.post(url, { email });
    console.log('Password reset link sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending password reset link:', error);
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/reset-password/${token}`,
      { password: newPassword }
    );
    return response.data; // Return the response or just a success message
  } catch (error) {
    console.error('Error resetting password:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};
