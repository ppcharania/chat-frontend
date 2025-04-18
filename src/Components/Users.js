import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myStyles.css';
import { useNavigate } from 'react-router-dom';
import logo from './chat.png';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const others = res.data.filter(u => String(u.id) !== String(userId));
        setUsers(others);
        setFiltered(others);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [userId, token]);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearch(text);
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(text));
    setFiltered(filteredUsers);
  };

  return (
    <div className='list-container'>
      <div className='ug-header'>
        <img src={logo} alt='logo' style={{ height: '2rem', width: '2rem', marginLeft: '10px' }} />
        <p className='ug-title'>All Users</p>
      </div>

      <div className='sb-search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input
          placeholder='Search users...'
          className='search-box'
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className='ug-list'>
        {filtered.map((user) => (
          <div
            className='list-item'
            key={user.id}
            onClick={() =>
              navigate('/app/chat', {
                state: {
                  currentChat: {
                    name: user.name,
                    receiverId: user.id,
                    senderId: userId,
                  },
                },
              })
            }
          >
            <p className='con-icon' style={{marginRight:"10px"}}>{user.name[0]}</p>
            <p className='con-title'>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
