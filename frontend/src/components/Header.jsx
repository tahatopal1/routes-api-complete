import React from 'react';
import logo from '../assets/airlines.svg';

const Header = () => {
  return (
    <header className="header" style={{
      backgroundColor: 'var(--primary-red)',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 50,
      position: 'relative'
    }}>
      <img src={logo} alt="Airlines Logo" style={{ height: '32px' }} />
    </header>
  );
};

export default Header;
