import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HospitalList from './components/ClinicList';
import HospitalDetail from './components/ClinicDetail';
import { hospitalData } from './data/clinics';
import './App.css';

function App() {
  // 랜덤으로 섞인 병원 목록 생성
  const shuffledHospitals = useMemo(() => {
    const shuffled = [...hospitalData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const [selectedHospital, setSelectedHospital] = useState(shuffledHospitals[0]);
  const [activeTab, setActiveTab] = useState('병원 소개');

  // 병원 선택 핸들러
  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setActiveTab('병원 소개');
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 로고 클릭 핸들러
  const handleLogoClick = () => {
    setSelectedHospital(shuffledHospitals[0]);
    setActiveTab('병원 소개');
  };

  return (
    <div className="app-container">
      <Header onLogoClick={handleLogoClick} />
      <main className="main-content">
        <HospitalList 
          hospitals={shuffledHospitals} 
          selectedHospital={selectedHospital}
          onHospitalSelect={handleHospitalSelect}
        />
        <HospitalDetail 
          hospital={selectedHospital}
          hospitals={shuffledHospitals}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;