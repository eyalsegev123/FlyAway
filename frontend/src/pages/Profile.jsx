import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import apiService from "../utils/api";

const ProfilePage = () => {
  const [userData, setUserData] = useState({ name: '', mail: '', password: '', birthday: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setMessage('');
      return;
    }

    apiService.getUserProfile(userId)
      .then(response => {
        if (response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          setMessage('User not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setMessage('Error fetching user data.');
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    apiService.updateUser(userId, userData)
      .then(() => {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setMessage('Error updating profile.');
      });
  };

  const displayBirthday = userData.birthday
  ? new Date(userData.birthday).toLocaleDateString('en-CA') // Format as YYYY-MM-DD
  : '';

  return (
    <ProfileContainer>
      <h2 style={{ color: '#00bfff' }}>Your Personal Details</h2>
      {message && <p className="message">{message}</p>}

      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        disabled={!isEditing}
      />

      <label>Email:</label>
      <input
        type="email"
        name="mail"
        value={userData.mail}
        onChange={handleChange}
        disabled={!isEditing}
      />

      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={""}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Enter new password or leave as is"
      />

      <label>Birthday:</label>
      <input
        type="date"
        name="birthday"
        value={displayBirthday}
        onChange={handleChange}
        disabled={!isEditing}
      />

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      ) : (
        <>
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      )}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
    color: rgb(255, 255, 255);
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    color: rgb(255, 255, 255);
    background-color: #333;
  }

  button {
    margin-top: 15px;
    margin-right: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #00bfff;
    color: white;

    &:hover {
      background-color: #00ace6;
    }
  }

  .message {
    color: green;
    font-weight: bold;
  }
`;

export default ProfilePage;
