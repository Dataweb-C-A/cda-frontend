import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import '../../assets/scss/navbar.scss';

function Navbar() {
  return (
    <nav className="navbar">
      <img src="https://admin.rifa-max.com/static/media/ticket.1e676ae5de33fcd376d5.png" width='77px' height='50px' alt="logo" />
      <div>
        <a href='#'><BsFillPersonFill className='user-icon' /></a>
      </div>
      <div className='menu'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
