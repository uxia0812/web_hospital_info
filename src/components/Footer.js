import React from 'react';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        모두의 똑독한 선택, 글로벌 성형 플랫폼 Prettying<br />
        지금 바로 다운받아 보세요!
      </p>
      <div className="download-buttons">
        <button className="ios-button">
          <img src="/images/apple.png" alt="Apple" className="button-icon" />
          Download for iOS
        </button>
        <button className="android-button">
          <img src="/images/google.png" alt="Android" className="button-icon" />
          Download for Android
        </button>
      </div>
      <div className="qr-code">
        <img src="/images/qr.png" alt="QR Code" />
      </div>
    </footer>
  );
}

export default Footer;