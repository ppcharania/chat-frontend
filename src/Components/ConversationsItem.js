import React from 'react';
import './myStyles.css';
import { useNavigate } from 'react-router-dom';

function ConversationsItem({ props, onClick }) {
  const navigate = useNavigate();
  return (
    <div className='conversation-container' onClick={() => onClick()}>
      <p className='con-icon'>{props.name[0]}</p>
      <p className='con-title'>{props.name}</p>
      <p className='con-lastMessage'>{props.lastMessage}</p>
      <p className='con-timeStamp'>{props.timeStamp}</p>
    </div>
  );
}

export default ConversationsItem;