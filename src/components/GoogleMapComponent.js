import React, { useEffect, useRef } from 'react';
import '../styles/components/GoogleMapComponent.css';

function GoogleMapComponent({ address }) {
  const mapRef = useRef(null);
  const apiKey = 'AIzaSyArOmpe4FcCZXo5Bba6UY-7yWtdyOXKORQ'; 

  useEffect(() => {
    // 실제 Google Maps API를 사용하려면 스크립트를 동적으로 로드
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initMap(); // Google Maps API가 이미 로드된 경우 바로 초기화
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true; // 비동기 로딩
      script.defer = true; // 비동기 로딩이 끝날 때까지 DOM 로딩 대기
      script.onload = initMap; // API 로드 후 initMap 함수 실행
      document.head.appendChild(script);
    };

    // 지도 초기화 함수
    const initMap = () => {
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.5665, lng: 126.9780 }, // 서울 기본 좌표
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // 주소로 위치 찾기
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            
            // 마커 추가
            new window.google.maps.Marker({
              map: map,
              position: location,
              animation: window.google.maps.Animation.DROP
            });
          }
        });
      } else {
          console.error('Google Maps API 로딩 실패');
        }
    };

    // API 키가 있을 경우 구글 맵 로드
    if (apiKey == 'AIzaSyArOmpe4FcCZXo5Bba6UY-7yWtdyOXKORQ') {
      loadGoogleMapsScript();
    } else {
      // API 키가 없는 경우 대체 지도 표시
      renderStaticMap();
    }

  // clean up function: 이 컴포넌트가 언마운트 될 때 스크립트를 제거
      return () => {
        const scriptElements = document.querySelectorAll('script[src^="https://maps.googleapis.com/maps/api/js"]');
        scriptElements.forEach(script => script.remove());  // 중복 로딩 방지
      };

    }, [address, apiKey]);  // 주소나 API 키가 변경될 때마다 다시 실행

  // API 키가 없을 때 대체 지도
  const renderStaticMap = () => {
    if (mapRef.current) {
      const ctx = mapRef.current.getContext('2d');
      
      // 캔버스 설정
      const canvas = mapRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // 배경
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 격자 패턴
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // 중앙 마커
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // 마커 핀
      ctx.fillStyle = '#3182f6';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 15, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 5);
      ctx.lineTo(centerX - 10, centerY + 15);
      ctx.lineTo(centerX + 10, centerY + 15);
      ctx.closePath();
      ctx.fill();
      
      // 텍스트
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Google Maps를 불러오지 못했습니다.', centerX, centerY + 40);
      ctx.font = '12px Arial';
      ctx.fillText(address, centerX, centerY + 60);
    }
  };

  return (
    <div className="google-map-container"> 
      {apiKey === ' ' ? (
        <canvas ref={mapRef} className="google-map-canvas" />
      ) : (
        <div ref={mapRef} className="google-map" />
      )}
    </div>
  );
}

export default GoogleMapComponent;