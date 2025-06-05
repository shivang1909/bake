import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get('accessToken');
    const refreshToken = query.get('refreshToken');

    const storeAndRedirect = async () => {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        try {
          const userDetails = await fetchUserDetails();
          dispatch(setUserDetails(userDetails.data));

          toast.success(`Welcome, ${userDetails.data.name || "User"}!`);
          navigate('/');
        } catch (err) {
          toast.error('Failed to fetch user data');
          navigate('/login');
        }
      } else {
        toast.error('Google login failed');
        navigate('/login');
      }
    };

    storeAndRedirect();
  }, [navigate, dispatch]);

  return <div>Logging in with Google...</div>;
};

export default AuthSuccess;
