import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/UserService';
// import useAuth from '../hooks/useAuth';
// import Layout from '../components/Layout';
import '../assets/styles/AddSubAdmin.css';

const AddSubAdmin = () => {
//   const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Finance Manager',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

//   useEffect(() => {
//     if (user && user.role !== 'admin') {
//       alert('You do not have permission to access this page.');
//       navigate('/dashboard');
//     }
//   }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData);
      const data = await createUser(formData);
      console.log(data);
      alert('User created successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        role: 'Finance Manager',
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Error creating user');
    }
  };

//   const navigateToUsers = () => {
//     if (user && user.role === 'admin') {
//       navigate('/users');
//     } else {
//       alert('You do not have permission to access this page.');
//     }
//   };

  return (
      <div className="form-container">
        <h2>Create User</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="mobile Number"
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Delivery Partner">Delivery Partner</option>
            
          </select>
          <button type="submit" className="submit-btn">Create User</button>
        </form>

        {/* <button onClick={navigateToUsers} className="go-to-users-btn">Go to Users List</button> */}
      </div>
  );
};

export default AddSubAdmin;
