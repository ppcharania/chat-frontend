import React, { useState } from 'react';
import './myStyles.css';
import logo from './chat.png';
import Button from '@mui/joy/Button';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, {
        name,
        email,
        password
      });
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='login-container'>
      <div className='image-container'>
        <img src={logo} alt='Logo' className='welcome-logo' />
      </div>
      <div className='login-box'>
        <p className='login-header'>Create a New Account</p>
        <TextField
          label='Enter Name'
          variant='outlined'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label='Enter Email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label='Enter Password'
          type='password'
          variant='outlined'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant='outlined' onClick={handleRegister}>Register</Button>
        <p style={{ color: '#63d7b0', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;
