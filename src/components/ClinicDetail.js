import React, { useEffect, useRef } from 'react';
import TabContent from './TabContent';
import '../styles/components/ClinicDetail.css';
import ImageSlider from './ImageSlider';

function HospitalDetail({ hospital, hospitals, activeTab, onTabChange }) {
  // 병원 상세 컴포넌트의 ref 추가
  const detailRef = useRef(null);
  
  // 페이지가 변경될 때마다 스크롤을 맨 위로 이동
  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [hospital]);

  // 실제로 사용할 병원 데이터 결정
  const displayHospital = hospital || (hospitals && hospitals.length > 0 ? hospitals[0] : null);
  
  // 표시할 병원이 없는 경우 (로딩 중이거나 데이터가 없는 경우) 로딩 표시
  if (!displayHospital) {
    return (
      <div className="hospital-detail">
        <div className="loading">
          <p>병원 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }
  
  // 콘텐츠 탭 (병원 정보 탭)
  const contentTabs = ['병원 소개', '운영시간', '주소', 'AI 인사이트'];

  // 병원 이미지
  const hospitalImages = displayHospital.images || [];

  return (
    <div className="hospital-detail" ref={detailRef}>
      {/* 이미지 슬라이더 추가 */}
      <ImageSlider images={hospitalImages} hospitalId={displayHospital.id} />
      <div className="hospital-header">
        <h2 className="hospital-title">{displayHospital.name}</h2>
        <p className="hospital-doctor">{displayHospital.doctor}</p>
      </div>
      
      {/* 카테고리 탭 */}
      {displayHospital.tags && (
        <div className="category-tabs">
          {displayHospital.tags.map((tag, index) => (
            <span key={index} className='tag'>
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* 콘텐츠 탭 */}
      <div className="content-tabs">
        {contentTabs.map((tab) => (
          <button 
            key={tab} 
            className={`content-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* 탭 내용 */}
      <div className="tab-content">
        <TabContent 
          hospital={displayHospital} 
          activeTab={activeTab} 
        />
      </div>
    </div>
  );
}

export default HospitalDetail;