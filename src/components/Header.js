import React from 'react';
import '../styles/components/Header.css';

function Header({ onLogoClick }) {
  return (
    <header className="header">
      <div className="logo-container">
        <img 
          src="/images/logo.png" 
          alt="Prettying" 
          className="logo" 
          onClick={onLogoClick}
        />
      </div>
    </header>
  );
}

export default Header;
