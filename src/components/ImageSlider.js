import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/ImageSlider.css';
import '../components/ClinicList';

function ImageSlider({ images, hospitalId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef();
  const autoPlayTimeoutRef = useRef();

  // 병원이 변경될 때마다 이미지 인덱스를 0으로 리셋
  useEffect(() => {
    setCurrentIndex(0);
  }, [hospitalId]);

  // 슬라이더 자동 재생
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3초마다 이미지 전환
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, images.length]);

  // 사용자가 조작 시 자동 재생을 잠시 멈췄다가 재개하는 함수
  const resetAutoPlay = () => {
    setIsAutoPlaying(false);

    // 이전 타이머 제거
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    // 2초 후 자동재생 다시 시작
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 2000);
  };

  // 이전 이미지로 이동
  const prevSlide = () => {
    resetAutoPlay();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 다음 이미지로 이동
  const nextSlide = () => {
    resetAutoPlay();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 특정 인덱스로 이동
  const goToSlide = (index) => {
    resetAutoPlay();
    setCurrentIndex(index);
  };

  return (
    <div className="image-slider">
      <div className="slider-container">
        <button className="slider-arrow prev-arrow" onClick={prevSlide}>&lt;</button>
        <div className="slider-images">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Hospital image ${index + 1}`}
              className={`slider-image ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        <button className="slider-arrow next-arrow" onClick={nextSlide}>&gt;</button>
      </div>
      <div className="slider-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;