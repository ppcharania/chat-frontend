import React, { useState, useEffect, useRef } from 'react';
import './myStyles.css';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import socket from '../socket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ChatArea() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const currentChat = location.state?.currentChat;

  const parseLocalTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    if (!currentChat || !userId) return;

    setMessages([]); // clear old messages

    const fetchMessages = async () => {
      try {
        let res;

        if (currentChat.isGroupChat) {
          console.log("🧠 Fetching messages for chat:", currentChat);
          res = await axios.get(`http://localhost:5001/api/messages/group/${currentChat.chatId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        } else {
          res = await axios.get(
            `http://localhost:5001/api/messages/${userId}/${currentChat.receiverId}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
        }

        setMessages(res.data);
        console.log('📥 Loaded messages:', res.data);
      } catch (err) {
        console.error('❌ Error fetching messages:', err);
      }
    };

    fetchMessages();

    if (!socket.connected) socket.connect();

    const roomId = currentChat.isGroupChat
      ? `group-${currentChat.chatId}`
      : `${Math.min(userId, currentChat.receiverId)}-${Math.max(userId, currentChat.receiverId)}`;

    socket.emit('join_chat', {
      senderId: String(userId),
      receiverId: String(currentChat.receiverId),
      room: roomId,
    });

    socket.on('receive_message', (message) => {
      console.log('📡 Incoming message:', message); // <== does it have sender_name?
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
      socket.emit('leave_chat', {
        senderId: String(userId),
        receiverId: String(currentChat.receiverId),
        room: roomId,
      });
    };
  }, [currentChat, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    const content = newMessage.trim();
    if (!content) return;

    const messageData = currentChat.isGroupChat
      ? {
          senderId: String(userId),
          chatId: currentChat.chatId,
          content,
          isGroupChat: true,
        }
      : {
          senderId: String(userId),
          receiverId: String(currentChat.receiverId),
          content,
        };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className='chatArea-container'>
      <div className='chatArea-header'>
        <p className='con-icon'>{currentChat?.name[0]}</p>
        <div className='header-text'>
          <p className='con-title'>{currentChat?.name}</p>
          <p className='con-timeStamp'>{new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}</p>
        </div>
      </div>
      <div className='messages-container'>
        {messages.map((message, index) => {
          const formattedTime = parseLocalTime(message.created_at);
          return String(message.sender) === String(userId) ? (
            <MessageSelf key={index} props={{ message: message.content, timeStamp: formattedTime }} />
          ) : (
            <MessageOthers
              key={index}
              props={{
                name: message.sender_name || currentChat.name,
                message: message.content,
                timeStamp: formattedTime,
              }}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className='text-input-area'>
        <input
          placeholder='Type a Message'
          className='search-box-text-in'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
