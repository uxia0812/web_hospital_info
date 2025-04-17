import React, { useMemo } from 'react'; // useMemo 추가
import '../styles/components/ClinicList.css';

function HospitalList({ hospitals, selectedHospital, onHospitalSelect }) {
  // 병원 리스트를 렌더링 시에 한 번만 랜덤으로 섞도록 useMemo 사용
  const shuffledHospitals = useMemo(() => {
    const shuffled = [...hospitals];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [hospitals]); // 병원 데이터가 바뀔 때만 다시 섞음

  return (
    <div className="hospital-list">
      {shuffledHospitals.map((hospital) => (
        <div 
          key={hospital.id} 
          className={`hospital-card ${selectedHospital && selectedHospital.id === hospital.id ? 'selected' : ''}`}
          onClick={() => onHospitalSelect(hospital)}
        >
          <div className="hospital-image">
            <img src={hospital.image} alt={hospital.name} />
          </div>
          <div className="hospital-info">
            <h3 className="hospital-name">{hospital.name}</h3>
            <p className="hospital-category">{hospital.category}</p>
            <p className="hospital-address">{hospital.address}</p>
            <div className="hospital-tags">
              {hospital.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HospitalList;



// function HospitalList({ hospitals, selectedHospital, onHospitalSelect }) {
//   return (
//     <div className="hospital-list">
//       {hospitals.map((hospital) => (
//         <div 
//           key={hospital.id} 
//           className={`hospital-card ${selectedHospital && selectedHospital.id === hospital.id ? 'selected' : ''}`}
//           onClick={() => onHospitalSelect(hospital)}
//         >
//           <div className="hospital-image">
//             <img src={hospital.image} alt={hospital.name} />
//           </div>
//           <div className="hospital-info">
//             <h3 className="hospital-name">{hospital.name}</h3>
//             <p className="hospital-category">{hospital.category}</p>
//             <p className="hospital-address">{hospital.address}</p>
//             <div className="hospital-tags">
//               {hospital.tags.map((tag, index) => (
//                 <span key={index} className="tag">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default HospitalList;