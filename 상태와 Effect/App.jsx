import { useState } from 'react';
import { initialLions } from './data/lion'; // 파일 경로가 맞는지 꼭 확인하세요!
import './styles/App.css';

// 1. 요약 카드 컴포넌트
function LionCard({ data, specialBorder, onClick }) {
  return (
    <div className={`my-card ${specialBorder ? 'special-card' : ''}`} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}>
      {/* partKey가 없으면 part를 기본값으로 사용하도록 방어 코드 추가 */}
      <span className={`badge ${data.partKey || data.part}`}>{data.part}</span>
      {data.image ? (
        <img src={data.image} alt={data.name} className="card-avatar" />
      ) : (
        <div className="card-avatar-placeholder"></div>
      )}
      <h3>{data.name}</h3>
      <h4>{data.part?.toUpperCase()} DEVELOPER</h4>
      <p>{data.quote || data.intro}</p>
    </div>
  );
}

// 2. 메인 App 컴포넌트
function App() {
  const [lions, setLions] = useState(initialLions);
  const [status, setStatus] = useState("준비 완료");
  const [lastAction, setLastAction] = useState(null);

  // 보기 옵션 상태 관리
  const [filterPart, setFilterPart] = useState("all"); 
  const [sortOrder, setSortOrder] = useState("latest"); 
  const [searchQuery, setSearchQuery] = useState(""); 

  // 폼 모달 및 입력 데이터 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [formData, setFormData] = useState({
    name: "",
    part: "FRONTEND",
    quote: "",
    email: "",
    github: "",
    phone: "",
    skills: "",
    fullIntroduction: "",
    determination: ""
  });

  // API 데이터를 형식에 맞게 변환
  const mapApiToLion = (user) => {
    const isFrontend = Math.random() > 0.5;
    return {
      id: user.login.uuid,
      name: user.name.first,
      part: isFrontend ? "FRONTEND" : "BACKEND",
      partKey: isFrontend ? "React" : "Node.js", // CSS 클래스 매칭을 위해 필수 추가!
      quote: "Hello! I am a global baby lion.",
      image: user.picture.large,
      isMe: false, 
      contact: { email: user.email, github: "https://github.com", phone: user.phone },
      skills: isFrontend ? ["HTML", "CSS", "React"] : ["Node.js", "Express", "MongoDB"],
      fullIntroduction: `안녕하세요, ${user.name.first}입니다. 저는 ${user.location.country}에서 왔습니다!`,
      determination: "열심히 하겠습니다."
    };
  };

  // [기능] 랜덤 추가 (함수명 내부 에러 완벽 수정)
  const executeAddRandom = async (count) => {
    setStatus("불러오는 중...");
    try {
      const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      const data = await response.json();
      const newLions = data.results.map(mapApiToLion);
      setLions(prev => [...prev, ...newLions]); 
      setStatus("완료!");
      setTimeout(() => setStatus("준비 완료"), 1500); 
      setLastAction(null); 
    } catch (error) {
      setStatus("실패");
      // ⭐ 이 부분의 오타를 executeAddRandom으로 완벽하게 수정했습니다!
      setLastAction(() => () => executeAddRandom(count));
    }
  };

  // [핵심 기능] 전체 새로고침
  const executeRefreshAll = async () => {
    setStatus("불러오는 중...");
    const currentCount = lions.length;
    const myCards = lions.filter(lion => lion.isMe);
    const needCount = currentCount - myCards.length;

    try {
      const response = await fetch(`https://randomuser.me/api/?results=${needCount}&nat=us,gb,ca,au,nz`);
      if (!response.ok) throw new Error("서버 응답 에러");
      const data = await response.json();
      const newLions = data.results.map(mapApiToLion);

      setLions([...myCards, ...newLions]);
      setStatus("완료!");
      setTimeout(() => setStatus("준비 완료"), 1500);
      setLastAction(null);
    } catch (error) {
      setStatus("실패");
      setLastAction(() => () => executeRefreshAll());
    }
  };

  // "랜덤 값 채우기" 버튼 활성화 함수
  const fillFormWithRandom = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?nat=us,gb');
      const data = await response.json();
      const user = data.results[0];
      const isFrontend = Math.random() > 0.5;
      
      setFormData({
        name: user.name.first,
        part: isFrontend ? "FRONTEND" : "BACKEND",
        quote: "API를 통해 자동 완성된 한줄평입니다.",
        email: user.email,
        github: `https://github.com/${user.name.first.toLowerCase()}`,
        phone: user.phone,
        skills: isFrontend ? "HTML, CSS, React" : "Node.js, Express",
        fullIntroduction: `안녕하세요, ${user.name.first}라고 합니다. 미국에서 온 아기사자입니다!`,
        determination: "끝까지 살아남아 멋진 사자가 되겠습니다."
      });
    } catch (error) {
      alert("랜덤 데이터를 가져오는데 실패했습니다.");
    }
  };

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
      skills: ["React", "JavaScript"],
      fullIntroduction: "새로 합류한 아기사자입니다!",
      determination: "화이팅!"
    };
    setLions([...lions, newLion]);
  };

  const deleteLastLion = () => {
    if (lions.length <= 0) return;
    setLions(lions.slice(0, -1));
  };

  // 모달 닫기 및 폼 초기화 헬퍼 함수
  const handleCloseModal = () => {
    setFormData({
      name: "", part: "FRONTEND", quote: "", email: "",
      github: "", phone: "", skills: "", fullIntroduction: "", determination: ""
    });
    setIsModalOpen(false);
  };

  // 모든 필드가 채워졌는지 유효성 검사 (공백 제외)
  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  // 수동 입력 폼 제출 핸들러
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return; // 유효하지 않으면 차단

    const newCustomLion = {
      id: Date.now(),
      name: formData.name,
      part: formData.part,
      partKey: formData.part === "FRONTEND" ? "React" : "Node.js",
      quote: formData.quote,
      image: null, // 직접 추가는 프로필 사진 없음 (플레이스홀더 적용됨)
      isMe: false,
      contact: { EMAIL: formData.email, GITHUB: formData.github, PHONE: formData.phone },
      skills: formData.skills.split(",").map(s => s.trim()), // 쉼표 기준 배열 변환
      fullIntroduction: formData.fullIntroduction,
      determination: formData.determination
    };

    setLions(prev => [...prev, newCustomLion]);
    handleCloseModal(); // 추가 후 닫기
  };

  // 실시간 필터링/정렬 가공
  const filteredLions = lions
    .filter(lion => {
      if (filterPart === "all") return true;
      return lion.part.toLowerCase() === filterPart.toLowerCase();
    })
    .filter(lion => {
      return lion.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name); 
      }
      return 0; 
    });
  
  const isLoading = status === "불러오는 중...";

  return (
    <div className="container">
      {/* 상단 컨트롤 패널 */}
      <header className="control-panel">
        <div className="panel-row">
          <button onClick={() => setIsModalOpen(true)}>아기 사자 추가</button>
          <button onClick={deleteLastLion}>마지막 아기 사자 삭제</button>
          <span className="total-count">총 {lions.length}명</span>
        </div>
        <div className="panel-row">
          <button onClick={() => executeAddRandom(1)} disabled={isLoading}>랜덤 1명 추가</button>
          <button onClick={() => executeAddRandom(5)} disabled={isLoading}>랜덤 5명 추가</button>
          <button onClick={executeRefreshAll} disabled={isLoading}>전체 새로고침</button>
          
          <span className={`async-status status-${status.replace("!", "").replace("...", "")}`}>{status}</span>

          {status === "실패" && lastAction && (
            <button className="retry-btn" onClick={lastAction}>🔄 재시도</button>
          )}
        </div>

        {/* 필터 및 검색 바 */}
        <div className="view-options">
          <label htmlFor="filter-part">파트 </label>
          <select id="filter-part" value={filterPart} onChange={(e) => setFilterPart(e.target.value)}>
            <option value="all">전체</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>

          <label htmlFor="sort-order">정렬 </label>
          <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="latest">최신추가순</option>
            <option value="name">이름순</option>
          </select>

          <label htmlFor="search-input">검색 </label>
          <input 
            id="search-input"
            type="text" 
            placeholder="이름으로 검색" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </header>
      
      {filteredLions.length === 0 ? (
        <div className="empty-state">
          <p>🔍 조건에 맞는 아기사자가 존재하지 않습니다.</p>
        </div>
      ) : (
        <>
          {/* 중단 요약 카드 리스트 */}
          <h2 className="section-title">요약 카드 목록</h2>
          <main className="card-wrapper">
            {filteredLions.map((lion) => (
              <div key={lion.id}>
                <LionCard data={lion} specialBorder={lion.isMe} />
              </div>
            ))}
          </main>

          <hr />

          {/* 하단 상세 카드 리스트 */}
          <h2 className="section-title">상세 정보 목록</h2>
          <section className="detail-wrapper">
            {filteredLions.map((lion) => (
              <div className="detail-card" key={lion.id}>
                <h2>아기사자 {lion.name}</h2>
                <h4>{lion.part} DEVELOPER</h4>
                <p className="association">HUFSLION</p>
                
                <div className="introduction">
                  <h3>INTRODUCTION</h3>
                  <p>{lion.intro || lion.fullIntroduction || lion.quote}</p>
                </div>

                <div className="contact">
                  <h3>CONTACT</h3>
                  <ul>
                    <li>EMAIL: {lion.contact?.email || lion.contact?.EMAIL}</li>
                    <li>
                      GITHUB: <a href={lion.contact?.github || lion.contact?.GITHUB} target="_blank" rel="noreferrer">
                        {lion.contact?.github || lion.contact?.GITHUB}
                      </a>
                    </li>
                    <li>PHONE: {lion.contact?.phone || lion.contact?.PHONE}</li>
                  </ul>
                </div>

                <div className="list">
                  <h3>BASIC SKILLS</h3>
                  <ul>
                    {lion.skills?.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="determination">
                  <h3>DETERMINATION</h3>
                  <p>{lion.determination || "멋진 사자가 되겠습니다!"}</p>
                </div>
              </div>
            ))}
          </section>
        </>
      )} 
    {/*수동 추가 폼 모달 팝업 구조 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🦁 아기사자 수동 명단 추가</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>이름</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>파트</label>
                <select value={formData.part} onChange={(e) => setFormData({...formData, part: e.target.value})}>
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                </select>
              </div>
              <div className="form-group">
                <label>한줄평</label>
                <input type="text" value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>깃허브 주소</label>
                <input type="text" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>보유 기술 (쉼표 구분)</label>
                <input type="text" placeholder="React, JavaScript" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
              </div>
              <div className="form-group">
                <label>상세 소개</label>
                <textarea value={formData.fullIntroduction} onChange={(e) => setFormData({...formData, fullIntroduction: e.target.value})} />
              </div>
              <div className="form-group">
                <label>각오</label>
                <input type="text" value={formData.determination} onChange={(e) => setFormData({...formData, determination: e.target.value})} />
              </div>

              <div className="modal-actions">
                {/* 🎲 랜덤 값 채우기 버튼 */}
                <button type="button" className="btn-random-fill" onClick={fillFormWithRandom}>🎲 랜덤 값 채우기</button>
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>취소</button>
                {/* 📝 모든 칸이 안 채워지면 버튼이 비활성화(disabled) 처리됩니다. */}
                <button type="submit" className="btn-submit" disabled={!isFormValid}>제출하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;