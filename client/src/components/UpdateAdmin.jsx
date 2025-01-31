import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/updateAdmin.css';
 

const UpdateUserPage = ({userdetail,isRedirect,updateData,uindex}) => {
  const [user, setUser] = useState(userdetail);
  console.log(userdetail);
  
  const [originalUser, setOriginalUser] = useState(null); // To store the original user data
  const [error, setError] = useState(null);
  console.log(userdetail._id);

  // const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const token = localStorage.getItem('authToken'); // Get the token from localStorage
      await axios.put(`http://localhost:5000/api/admin/update/${userdetail._id}`, user, {
        withCredentials: true,
      });
      isRedirect(false);
      updateData((prevItems) =>
        prevItems.map((item, idx) =>
          idx === uindex ? { ...item, ...user } : item
        )
      );
      // updateData(user);
      navigate('/dashboard/admin-list');
    } catch (err) {
      setError('Error updating user');
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (JSON.stringify(user) === JSON.stringify(originalUser)) {
      navigate('/dashboard/admin-list');
    } else {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate('/dashboard/admin-list');
      }
    }
};

  return (
  
      <div className="form-container">
        <h1>Update User</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
          />
          <input
            type="text"
            name="mobile"
            value={user.mobile}
            onChange={handleChange}
            placeholder="mobile"
            className="input-field"
          />
          <br />
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Finance Manager">Finance Manager</option>
            <option value="Delivery Partner">Delivery Partner</option>
            <option value="Inventory Manager">Inventory Manager</option>
          </select>
          <button type="submit" className="submit-btn">Update User</button>
        </form>

        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
  
  );
};

export default UpdateUserPage;
