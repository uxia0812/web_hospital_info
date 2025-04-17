import React from 'react';
import '../styles/components/Header.css';

function Header() {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img 
          src="/images/logo.png" 
          alt="Prettying" 
          className="logo" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
        <span className="web-preview">Web Preview</span>
      </div>
      <nav className="navigation">
        <button 
          className="download-button"
          onClick={() => window.open("https://prettying.net/home", "_blank")}
        >Prettying App 바로가기</button>
      </nav>
    </header>
  );
}

export default Header;