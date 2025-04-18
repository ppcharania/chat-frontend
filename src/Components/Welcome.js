import React from 'react'
import './myStyles.css'
import logo from './chat.png'
function Welcome() {
  return (
    <div className='welcome-container'>
      <img src={logo} alt="Logo" className='welcome-logo'/>
      <p>View and text directly to people present in the chat rooms.</p>
    </div>
  )
}

export default Welcome
