import React, { useState } from 'react';
import './myStyles.css';
import logo from './chat.png';
import Button from '@mui/joy/Button';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', {
        email,
        password,
      });

      const { id, token, name } = res.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
      navigate('/app/welcome');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='login-container'>
      <div className='image-container'>
        <img src={logo} alt='Logo' className='welcome-logo' />
      </div>
      <div className='login-box'>
        <p className='login-header'>Login to your Account</p>
        <TextField
          label='Enter Email'
          variant='outlined'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label='Enter Password'
          type='password'
          autoComplete='current-password'
          variant='outlined'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button variant='outlined' onClick={handleLogin}>Login</Button>
        <p
          style={{ color: '#63d7b0', cursor: 'pointer' }}
          onClick={() => navigate('/register')}
        >
          Don’t have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;