import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import '../assets/styles/adminListPage.css'; // Import the CSS file for styling
import { getUsers } from '../services/UserService';
import UpdateUserPage from '../components/UpdateAdmin'; // Assuming UpdateUserPage is a separate component

const AdminListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(false);
  const [userdata, setUser] = useState(null);
  const [userIndex, setUserIndex] = useState(null); 
  // const navigate = useNavigate();  // Hook to navigate between pages

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log(response);
        setUsers(response);
      } catch (err) {
        setError('Error fetching users');
      }
    };
    fetchUsers();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
        withCredentials: true,
      });

      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('Error deleting user');
    }
  };

  return (
    <>
      {update ? (
        <UpdateUserPage userdetail={userdata} isRedirect = {setUpdate} updateData ={setUsers} uindex ={userIndex}/> // Conditionally render the UpdateUserPage component
      ) : (
        <>
          <h1>User List</h1>
          {error && <p>{error}</p>}

          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,index) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() =>{setUpdate(true) ; setUser(user);setUserIndex(index)}}>Update</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default AdminListPage;
