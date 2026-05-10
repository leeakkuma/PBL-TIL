import { useState } from 'react';
import { initialLions } from './lion'; // 파일명이 lion.js인지 확인 필수!
import './App.css';

// 1. 요약 카드 컴포넌트
function LionCard({ data, specialBorder }) {
  return (
    <div className={`my-card ${specialBorder ? 'special-card' : ''}`}>
      <span className={`badge ${data.partKey}`}>{data.part}</span>
      {data.image ? (
        <img src={data.image} alt={data.name} className="card-avatar" />
      ) : (
        <div className="card-avatar-placeholder"></div>
      )}
      <h3>{data.name}</h3>
      <h4>{data.part?.toUpperCase()} DEVELOPER</h4>
      <p>{data.quote}</p>
    </div>
  );
}

// 2. 메인 App 컴포넌트
function App() {
  const [lions, setLions] = useState(initialLions);

  // 아기 사자 추가/삭제 함수 
  const addLion = () => {
    const newLion = {
      id: Date.now(),
      name: "새로운 사자",
      part: "FRONTEND",
      partKey: "React",
      quote: "열심히 하겠습니다!",
      image: null,
      isMe: false,
      contact: { EMAIL: "lion@example.com", GITHUB: "https://github.com", PHONE: "010-0000-0000" },
      skills: ["HTML", "CSS"],
      fullIntroduction: "새로 합류한 아기사자입니다!",
      determination: "최고의 개발자가 되겠습니다."
    };
    setLions([...lions, newLion]);
  };

  const deleteLastLion = () => {
    if (lions.length <= 0) return;
    setLions(lions.slice(0, -1));
  };

  return (
    <div className="container">
      {/* [A] 상단 컨트롤 패널 */}
      <header className="control-panel">
        <div className="panel-row">
          <button onClick={addLion}>아기 사자 추가</button>
          <button onClick={deleteLastLion}>마지막 아기 사자 삭제</button>
          <span className="total-count">총 {lions.length}명</span>
        </div>
        <div className="panel-row">
          <button>랜덤 1명 추가</button>
          <button>랜덤 5명 추가</button>
          <button onClick={() => setLions(initialLions)}>전체 새로고침</button>
          <span className="async-status">준비 완료</span>
        </div>

        <div className="view-options">
          <select id="filter-part">
            <option value="all">전체 파트</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>
          <select id="sort-order">
            <option value="latest">최신추가순</option>
            <option value="oldest">오래된순</option>
          </select>
          <input type="text" placeholder="이름으로 검색" />
        </div>
      </header>

      {/* [B] 중단 요약 카드 리스트 (9명) */}
      <h2 className="section-title">요약 카드 목록</h2>
      <main className="card-wrapper">
        {lions.map((lions) => (
          <div key={lions.id}>
            <LionCard data={lions} specialBorder={lions.isMe} />
          </div>
        ))}
      </main>

      <hr />

      {/* [C] 하단 상세 카드 리스트 (9명 전체 출력) */}
      <h2 className="section-title">상세 정보 목록</h2>
      <section className="detail-wrapper">
        {lions.map((lions) => (
          <div className="detail-card" key={lions.id}>
            <h2>아기사자 {lions.name}</h2>
            <h4>{lions.part} DEVELOPER</h4>
            <p>HUFSLION</p>
            
            <div className="introduction">
              <h3>INTRODUCTION</h3>
              <p>{lions.intro || lions.quote}</p>
            </div>

            <div className="contact">
              <h3>CONTACT</h3>
              <ul>
                <li>EMAIL: {lions.contact?.EMAIL}</li>
                <li>
                  GITHUB: <a href={lions.contact?.GITHUB} target="_blank" rel="noreferrer">
                    {lions.contact?.GITHUB}
                  </a>
                </li>
                <li>PHONE: {lions.contact?.PHONE}</li>
              </ul>
            </div>

            <div className="list">
              <h3>BASIC SKILLS</h3>
              <ul>
                {lions.skills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="determination">
              <h3>DETERMINATION</h3>
              <p>{lions.determination || "멋진 사자가 되겠습니다!"}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
