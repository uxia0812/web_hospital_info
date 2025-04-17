import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HospitalList from './components/ClinicList';
import HospitalDetail from './components/ClinicDetail';
import { hospitalData } from './data/clinics';
import './App.css';

function App() {
  const [selectedHospital, setSelectedHospital] = useState(null);
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

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <HospitalList 
          hospitals={hospitalData} 
          selectedHospital={selectedHospital}
          onHospitalSelect={handleHospitalSelect}
        />
        <HospitalDetail 
          hospital={selectedHospital}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;