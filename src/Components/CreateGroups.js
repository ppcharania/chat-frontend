import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myStyles.css';
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

function CreateGroups() {
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter((u) => String(u.id) !== String(userId));
        setAllUsers(filtered);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [userId, token]);

  const handleToggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      alert('Group name and at least 2 users required!');
      return;
    }

    try {
      const userIds = [...selectedUsers, parseInt(userId)];
      const res = await axios.post(
        'http://localhost:5001/api/chats/group',
        { groupName, userIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Group created:', res.data);
      alert('Group created successfully!');
      navigate('/app/groups');
    } catch (err) {
      console.error('❌ Error creating group:', err);
      alert('Error creating group.');
    }
  };

  return (
    <div className='list-container'>
      <div className='ug-header'>
        <GroupAddIcon style={{ marginLeft: '10px',}} />
        <p className='ug-title'>Create New Group</p>
      </div>

      <div className='sb-search'>
        <input
          type='text'
          placeholder='Enter group name'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className='search-box'
        />
      </div>

      <div className='ug-list'>
        {allUsers.map((user) => (
          <div
            key={user.id}
            className='list-item'
            style={{
              backgroundColor: selectedUsers.includes(user.id) ? '#d1e7dd' : 'white',
            }}
            onClick={() => handleToggleUser(user.id)}
          >
            <p className='con-icon'>{user.name[0]}</p>
            <p className='con-title'>{user.name}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={handleCreateGroup} className='group-create-button'>
          Create Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroups;
