import React, { useState, useEffect } from 'react';
import './myStyles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import ConversationsItem from './ConversationsItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit('register-user', userId);

    socket.on('online-users', (onlineIds) => {
      setOnlineUserIds(onlineIds);
    });

    return () => {
      socket.off('online-users');
    };
  }, [userId]);

  useEffect(() => {
    const fetchUsersAndLastMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const otherUsers = res.data.filter((user) => String(user.id) !== String(userId));
        const convList = await Promise.all(
          otherUsers.map(async (user) => {
            try {
              const res = await axios.get(
                `http://localhost:5001/api/messages/${userId}/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const lastMsg = res.data?.[res.data.length - 1];
              return {
                name: user.name,
                lastMessage: lastMsg ? lastMsg.content.slice(0, 25) + (lastMsg.content.length > 25 ? '...' : '') : 'Start chatting!',
                timeStamp: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }) : 'now',
                receiverId: user.id,
              };
            } catch {
              return {
                name: user.name,
                lastMessage: 'Start chatting!',
                timeStamp: 'now',
                receiverId: user.id,
              };
            }
          })
        );

        setConversations(convList);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };

    if (onlineUserIds.length > 0) {
      fetchUsersAndLastMessages();
    }
  }, [userId, onlineUserIds, token]);

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
    <div className='sidebar-container'>
      <div className='sb-header'>
        <div>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </div>
        <div>
          <IconButton onClick={() => navigate('/app/users')}>
            <PersonAddIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/app/groups')}>
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={() => navigate('/app/create-groups')}>
            <AddCircleIcon />
          </IconButton>
          <IconButton>
            <NightlightIcon />
          </IconButton>
        </div>
      </div>

      <div className='sb-search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder='Search' className='search-box' />
      </div>

      <div className='sb-conversations'>
        {conversations.length > 0 && (
          <h4 className='section-title'>Online Users</h4>
        )}
        {conversations.map((conversation) => (
          <ConversationsItem
            key={`user-${conversation.receiverId}`}
            props={{ ...conversation, senderId: userId }}
            onClick={() =>
              navigate('/app/chat', {
                state: {
                  currentChat: {
                    ...conversation,
                    senderId: userId,
                  },
                },
              })
            }
          />
        ))}

        {groups.length > 0 && <h4 className='section-title'>Groups</h4>}
        {groups.map((group) => (
          <ConversationsItem
            key={`group-${group.id}`}
            props={{
              name: group.chat_name,
              timeStamp: 'now',
              chatId: group.id,
              isGroupChat: true,
            }}
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
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
