import React from 'react';
import './myStyles.css';

function MessageOthers({ props }) {
  return (
    <div className='other-message-container'>
      <div className='conversation-container'>
        <p className='con-icon'>{props.name[0]}</p>
        <div className='other-text-content'>
          <p className='con-title'>{props.name}</p>
          <p className='con-lastmMessage'>{props.message}</p>
          <p className='self-timeStamp'>{props.timeStamp}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageOthers;
