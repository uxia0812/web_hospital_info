import React, { useMemo, useState, useRef, useEffect } from 'react'; // Modified: added useState, useRef, useEffect
import '../styles/components/ClinicList.css';

// New component for dynamic tag clipping
function TagList({ tags }) {
  const containerRef = useRef(null); // Modified: reference to tag container
  const [visibleCount, setVisibleCount] = useState(tags.length); // Modified: state for number of visible tags

  useEffect(() => {
    const computeVisible = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      let total = 0;
      let count = 0;
      const dummy = document.createElement('span');
      dummy.style.visibility = 'hidden';
      dummy.style.position = 'absolute';
      dummy.style.whiteSpace = 'nowrap';
      document.body.appendChild(dummy);

      // Measure tags
      for (let i = 0; i < tags.length; i++) {
        dummy.textContent = tags[i];
        dummy.className = 'tag';
        const w = dummy.offsetWidth + parseFloat(getComputedStyle(dummy).marginRight);
        if (total + w > containerWidth) break;
        total += w;
        count = i + 1;
      }

      // Measure +n tag width
      const remaining = tags.length - count;
      if (remaining > 0) {
        dummy.textContent = `+${remaining}`;
        dummy.className = 'tag tag-more';
        const moreW = dummy.offsetWidth + parseFloat(getComputedStyle(dummy).marginRight);
        // Ensure +n fits
        while (count > 0 && total + moreW > containerWidth) {
          const last = tags[count - 1];
          dummy.textContent = last;
          dummy.className = 'tag';
          const lastW = dummy.offsetWidth + parseFloat(getComputedStyle(dummy).marginRight);
          total -= lastW;
          count -= 1;
        }
      }
      document.body.removeChild(dummy);
      setVisibleCount(count);
    };

    computeVisible();
    window.addEventListener('resize', computeVisible); // Modified: recompute on resize
    return () => window.removeEventListener('resize', computeVisible);
  }, [tags]);

  if (visibleCount >= tags.length) {
    return (
      <div ref={containerRef} className="tag-list-container"> {/* Modified: width:100% 적용 */}
        {tags.map((tag, idx) => (
          <span key={idx} className="tag">{tag}</span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="tag-list-container" > {/* Modified: width:100% 적용 */}
      {tags.slice(0, visibleCount).map((tag, idx) => (
        <span key={idx} className="tag">{tag}</span>
      ))}
      <span className="tag tag-more">+{tags.length - visibleCount}</span>
    </div>
  );
}

function HospitalList({ hospitals, selectedHospital, onHospitalSelect }) {
  return (
    <div className="hospital-list">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className={`hospital-card ${selectedHospital && selectedHospital.id === hospital.id ? 'selected' : ''}`}
          onClick={() => onHospitalSelect(hospital)}
        >
          <div className="hospital-image">
            <img src={`${hospital.image}`} alt={hospital.name} />
          </div>
          <div className="hospital-info">
            <h3 className="hospital-name">{hospital.name}</h3>
            <p className="hospital-category">{hospital.category}</p>
            <p className="hospital-address">{hospital.address}</p>
            <div className="hospital-tags">
              <TagList tags={hospital.tags} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HospitalList;

