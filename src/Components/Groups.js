import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myStyles.css';
import logo from './chat.png';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Groups() {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/chats/user/${userId}/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (err) {
        console.error('❌ Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, [userId, token]);

  return (
    <div className='list-container'>
      <div className='ug-header'>
        <img src={logo} alt='Logo' style={{ height: '2rem', width: '2rem', marginLeft: '10px' }} />
        <p className='ug-title'>My Groups</p>
      </div>
      <div className='sb-search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder='Search Groups' className='search-box' />
      </div>
      <div className='ug-list'>
        {groups.map((group) => (
          <div
            key={group.id}
            className='list-item'
            onClick={() =>
              navigate('/app/chat', {
                state: {
                  currentChat: {
                    name: group.chat_name,
                    chatId: group.id,
                    isGroupChat: true,
                  },
                },
              })
            }
          >
            <p className='con-icon' style={{marginRight:"10px"}}>{group.chat_name[0]}</p>
            <p className='con-title'>{group.chat_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
