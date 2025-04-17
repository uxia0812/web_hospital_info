import React from "react";
import GoogleMapComponent from "./GoogleMapComponent";
import "../styles/components/TabContent.css";
import aiImage from "../data/ai.png";

function TabContent({ hospital, activeTab }) {
  if (!hospital) return null;

  // 주소 복사
  const copyAddress = () => {
    navigator.clipboard
      .writeText(hospital.address || "")
      .then(() => alert("주소가 클립보드에 복사되었습니다."))
      .catch((err) => console.error("주소 복사 중 오류가 발생했습니다:", err));
  };

  // 탭에 따라 다른 콘텐츠 렌더링
  switch (activeTab) {
    case "병원 소개":
      return (
        <div className="intro-content">
          <h3 className="intro-title">{hospital.intro.title}</h3>
          <ol className="intro-points">
            {(hospital.intro?.points || []).map((point, index) => (
              <li key={index} className="intro-point">
                {point}
              </li>
            ))}
          </ol>
          <p className="intro-conclusion">
            {(hospital.intro?.conclusion || "")
              .split("\n")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </p>
        </div>
      );

    case "운영시간":
      return (
        <div className="schedule-content">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>요일</th>
                <th>운영시간</th>
              </tr>
            </thead>
            <tbody>
              {(hospital.operatingHours || []).map((item, index) => (
                <tr key={index}>
                  <td>{item.day}</td>
                  <td className={item.hours === "휴진" ? "closed" : ""}>
                    {item.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "주소":
      if (!hospital.address) {
        return (
          <div className="location-content">
            <p className="address-text">주소 정보가 없습니다.</p>
          </div>
        );
      }

      return (
        <div className="location-content">
          <div className="map">
            <GoogleMapComponent address={hospital.address} />
          </div>
          <div className="address-container">
            <p className="address-text">{hospital.address}</p>
            <button
              className="copy-button"
              onClick={copyAddress}
              title="주소 복사하기"
            >
              복사
            </button>
          </div>
        </div>
      );

    case "AI 인사이트":
      return (
        <div className="ai-insight-content">
          <div className="ai-tag">
            <img className="ai-tag img" src={aiImage} alt="AI" />
            <h3 className="ai-title">{hospital.name} AI 인사이트</h3>
          </div>
          {(hospital.aiInsight?.paragraphs || []).map((paragraph, index) => (
            <p key={index} className="ai-paragraph">
              {paragraph}
            </p>
          ))}
          <p className="ai-disclaimer">
            이 내용은 AI에 의해 자동 생성된 것입니다.
          </p>
        </div>
      );

    default:
      return <p>탭 내용이 준비되지 않았습니다.</p>;
  }
}

export default TabContent;
