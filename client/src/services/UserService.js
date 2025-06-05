import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'




export const createUser = async (userData) => {
  try {
    const response = await Axios({ ...SummaryApi.AddAdmin,
                data: userData
              });
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
    const response = await Axios(SummaryApi.getAdmins);
   
    return response.data; // Return the list of users
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};




// Set password with additional response handling
export const setPassword = async (userId, password) => {
  try {
        const response = await Axios({
        method: SummaryApi.setPassword.method,
        url: SummaryApi.setPassword.url(userId), // dynamic URL
        data: password
      });


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
        const response = await Axios({ ...SummaryApi.verifyOtp,
                data: otpData
              });
    return response.data; // Expecting { message, token }
  } catch (error) {
    console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};




// Send password reset link
export const sendPasswordResetLink = async (email) => {
  try {
            const response = await Axios({ ...SummaryApi.forgotPass,
                data: email
              });
    console.log('Password reset link sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending password reset link:', error);
  }
};


// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
        const response = await Axios({
        method: SummaryApi.resetPass.method,
        url: SummaryApi.resetPass.url(token), // dynamic URL
        data: {password:newPassword}
      });
    return response.data; // Return the response or just a success message
  } catch (error) {
    console.error('Error resetting password:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};


