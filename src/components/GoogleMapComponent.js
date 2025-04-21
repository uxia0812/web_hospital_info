import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/components/GoogleMapComponent.css';

function GoogleMapComponent({ address }) {
  const mapRef = useRef(null);
  const [loadingError, setLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  // API 키가 없을 때 대체 지도
  const renderStaticMap = useCallback(() => {
    if (mapRef.current) {
      const ctx = mapRef.current.getContext('2d');
      
      // 캔버스 설정
      const canvas = mapRef.current;
      canvas.width = canvas.offsetWidth || 300;
      canvas.height = canvas.offsetHeight || 300;
      
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
  }, [address]);

  // 지도에 마커 추가
  const addMarker = useCallback((map, location) => {
    try {
      if (window.google && window.google.maps && map) {
        new window.google.maps.Marker({
          map: map,
          position: location,
          animation: window.google.maps.Animation.DROP
        });
      }
    } catch (error) {
      console.error('마커 추가 중 오류:', error);
    }
  }, []);

  // 주소로 위치 검색
  const geocodeAddress = useCallback((map, address) => {
    try {
      if (window.google && window.google.maps && map) {
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            addMarker(map, location);
          } else {
            console.error('Geocode 실패 : ' + status);
            setLoadingError(true);
          }
        });
      }
    } catch (error) {
      console.error('위치 검색 중 오류:', error);
      setLoadingError(true);
    }
  }, [addMarker]);

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        if (!window.google || !window.google.maps) {
          console.error('Google Maps API가 로드되지 않았습니다.');
          reject(new Error('Maps API not loaded'));
          return;
        }

        // 타이밍 문제를 해결하기 위해 지연 추가
        setTimeout(() => {
          try {
            if (!mapRef.current) {
              reject(new Error('Map container not found'));
              return;
            }

            const mapOptions = {
              center: { lat: 37.5665, lng: 126.9780 }, // 서울 기본 좌표
              zoom: 16,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            };

            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            setMapInstance(map);
            
            // 맵이 완전히 로드되었는지 확인
            window.google.maps.event.addListenerOnce(map, 'idle', () => {
              geocodeAddress(map, address);
              resolve(map);
            });

            // 맵 로드 에러 처리
            window.google.maps.event.addListenerOnce(map, 'error', () => {
              console.error('지도 로드 오류');
              reject(new Error('Map load error'));
            });
          } catch (error) {
            console.error('지도 초기화 중 오류:', error);
            reject(error);
          }
        }, 300); // 300ms 지연으로 API 구성요소가 완전히 로드되도록 함
      } catch (error) {
        console.error('지도 초기화 프로세스 오류:', error);
        reject(error);
      }
    });
  }, [address, geocodeAddress]);

  // 스크립트 로드 함수
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Google Maps API 스크립트 로드 오류');
      setLoadingError(true);
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, [apiKey]);

  // 스크립트 로드 효과
  useEffect(() => {
    if (apiKey) {
      loadGoogleMapsScript();
    } else {
      renderStaticMap();
      setIsLoading(false);
    }

    // 클린업 함수
    return () => {
      // 언마운트 시 전역 변수 및 이벤트 리스너 정리
      if (mapInstance) {
        // 필요한 경우 Google Maps 이벤트 리스너 제거
        // google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [apiKey, loadGoogleMapsScript, renderStaticMap, mapInstance]);

  // 스크립트 로드 완료 후 지도 초기화
  useEffect(() => {
    if (scriptLoaded && window.google && window.google.maps) {
      // 지도 컨테이너 확인
      if (!mapRef.current) {
        console.error('지도 컨테이너를 찾을 수 없습니다');
        setLoadingError(true);
        setIsLoading(false);
        return;
      }

      // 지도 초기화 시도
      initializeMap()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('지도 초기화 실패:', error);
          setLoadingError(true);
          setIsLoading(false);
        });
    }
  }, [scriptLoaded, initializeMap]);

  // 주소 변경 시 처리
  useEffect(() => {
    if (mapInstance && address && !isLoading && scriptLoaded) {
      geocodeAddress(mapInstance, address);
    }
  }, [address, mapInstance, isLoading, scriptLoaded, geocodeAddress]);

  return (
    <div className="google-map-container">
      {loadingError ? (
        <div className="google-map-error">
          <p>Google Maps를 불러올 수 없습니다. 다시 시도해주세요.</p>
          <p>오류가 계속되면 관리자에게 문의하세요.</p>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="google-map-loading">
              <p>지도를 불러오는 중입니다...</p>
            </div>
          )}
          {!apiKey ? (
            <canvas ref={mapRef} className="google-map-canvas" />
          ) : (
            <div 
              ref={mapRef} 
              className="google-map" 
              style={{ opacity: isLoading ? 0.6 : 1 }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default GoogleMapComponent;