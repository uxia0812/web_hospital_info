import React from 'react';
import TabContent from './TabContent';
import '../styles/components/ClinicDetail.css';
import ImageSlider from './ImageSlider';

function HospitalDetail({ hospital, activeTab, onTabChange }) {
  // 선택된 병원이 없는 경우 기본 화면 표시
  if (!hospital) {
    return (
      <div className="hospital-detail">
        <div className="empty-state">
          <div className="empty-icon">!</div>
          <p>좌측 리스트에서 궁금한 병원을 선택해주세요</p>
        </div>
      </div>
    );
  }
  
  // 콘텐츠 탭 (병원 정보 탭)
  const contentTabs = ['병원 소개', '운영시간', '주소', 'AI 인사이트'];

  // 병원 이미지
  const hospitalImages = hospital.images || [];

  return (
    <div className="hospital-detail">
      {/* 이미지 슬라이더 추가 */}
      <ImageSlider images={hospitalImages} hospitalId={hospital.id} />
      <div className="hospital-header">
        <h2 className="hospital-title">{hospital.name}</h2>
        <p className="hospital-doctor">{hospital.doctor}</p>
      </div>
      
      {/* 카테고리 탭 */}
      {hospital.tags && (
        <div className="category-tabs">
          {hospital.tags.map((tag, index) => (
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
          hospital={hospital} 
          activeTab={activeTab} 
        />
      </div>
    </div>
  );
}

export default HospitalDetail;




