import React from 'react';

function MessageSelf({ props }) {
  return (
    <div className='self-message-container'>
      <div className='messageBox'>
        <p>{props.message}</p>
        <p className='self-timeStamp'>{props.timeStamp}</p>
      </div>
    </div>
  );
}

export default MessageSelf;
