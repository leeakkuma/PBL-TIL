// ListPage.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { Lion } from './data/lion';
import './styles/App.css';
import { useNavigate } from 'react-router-dom';
import { useLionFilters } from './hooks/useLionFilters';

// props 타입 정의
interface LionCardProps {
  data: Lion;
  specialBorder: boolean;
  onClick: () => void;
}

interface LionFormData {
  name: string;
  part: string;
  quote: string;
  email: string;
  github: string;
  phone: string;
  skills: string;
  fullIntroduction: string;
  determination: string;
}

interface ListPageProps {
  lions: Lion[];
  loading: boolean;
  error: string | null;
  addLions: (newLions: Omit<Lion, 'id'>[]) => Promise<void>;
  deleteLast: () => Promise<void>;
  refreshRandom: (newLions: Omit<Lion, 'id'>[]) => Promise<void>;
}

// 1. 요약 카드 컴포넌트
function LionCard({ data, specialBorder, onClick }: LionCardProps) {
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

// 2. 메인 목록 페이지
function ListPage({ lions, loading, error, addLions, deleteLast, refreshRandom }: ListPageProps) {
  const [status, setStatus] = useState<string>("준비 완료");
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  const navigate = useNavigate();
  const { filterPart, sortOrder, searchQuery, updateParams } = useLionFilters();

  // 폼 모달 및 입력 데이터 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<LionFormData>({
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

  // randomuser API 응답 -> Lion(id 제외, id는 DB가 부여)
  const mapApiToLion = (user: any): Omit<Lion, 'id'> => {
    const isFrontend = Math.random() > 0.5;
    return {
      name: user.name.first,
      part: isFrontend ? "FRONTEND" : "BACKEND",
      partKey: isFrontend ? "React" : "Node.js", // CSS 클래스 매칭용
      quote: "Hello! I am a global baby lion.",
      image: user.picture.large,
      isMe: false,
      contact: { email: user.email, github: "https://github.com", phone: user.phone },
      skills: isFrontend ? ["HTML", "CSS", "React"] : ["Node.js", "Express", "MongoDB"],
      fullIntroduction: `안녕하세요, ${user.name.first}입니다. 저는 ${user.location.country}에서 왔습니다!`,
      determination: "열심히 하겠습니다."
    };
  };

  // [기능] 랜덤 N명 추가 -> Supabase에 저장
  const executeAddRandom = async (count: number): Promise<void> => {
    setStatus("불러오는 중...");
    try {
      const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      if (!response.ok) throw new Error("서버 응답 에러");
      const data = await response.json();
      const newLions = data.results.map(mapApiToLion);
      await addLions(newLions);
      setStatus("완료!");
      setTimeout(() => setStatus("준비 완료"), 1500);
      setLastAction(null);
    } catch (error) {
      setStatus("실패");
      setLastAction(() => () => executeAddRandom(count));
    }
  };

  // [핵심] 전체 새로고침: 내 카드는 유지, 나머지를 새 랜덤 명단으로 교체
  const executeRefreshAll = async (): Promise<void> => {
    setStatus("불러오는 중...");
    const myCards = lions.filter(lion => lion.isMe);
    const needCount = lions.length - myCards.length;
    try {
      let newLions: Omit<Lion, 'id'>[] = [];
      if (needCount > 0) {
        const response = await fetch(`https://randomuser.me/api/?results=${needCount}&nat=us,gb,ca,au,nz`);
        if (!response.ok) throw new Error("서버 응답 에러");
        const data = await response.json();
        newLions = data.results.map(mapApiToLion);
      }
      await refreshRandom(newLions);
      setStatus("완료!");
      setTimeout(() => setStatus("준비 완료"), 1500);
      setLastAction(null);
    } catch (error) {
      setStatus("실패");
      setLastAction(() => () => executeRefreshAll());
    }
  };

  // "랜덤 값 채우기": 폼 입력칸만 채움 (DB 저장은 제출 시)
  const fillFormWithRandom = async (): Promise<void> => {
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

  // 마지막 아기사자 삭제 -> Supabase에서 삭제
  const deleteLastLion = async (): Promise<void> => {
    if (lions.length === 0) return;
    setStatus("불러오는 중...");
    try {
      await deleteLast();
      setStatus("준비 완료");
      setLastAction(null);
    } catch (error) {
      setStatus("실패");
      setLastAction(() => deleteLastLion);
    }
  };

  // 모달 닫기 및 폼 초기화
  const handleCloseModal = (): void => {
    setFormData({
      name: "", part: "FRONTEND", quote: "", email: "",
      github: "", phone: "", skills: "", fullIntroduction: "", determination: ""
    });
    setIsModalOpen(false);
  };

  // 모든 필드가 채워졌는지 유효성 검사 (공백 제외)
  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  // 수동 입력 폼 제출 -> Supabase에 저장
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isFormValid) return;

    const newCustomLion: Omit<Lion, 'id'> = {
      name: formData.name,
      part: formData.part,
      partKey: formData.part === "FRONTEND" ? "React" : "Node.js",
      quote: formData.quote,
      image: null,
      isMe: false,
      contact: { email: formData.email, github: formData.github, phone: formData.phone },
      skills: formData.skills.split(",").map(s => s.trim()),
      fullIntroduction: formData.fullIntroduction,
      determination: formData.determination
    };

    try {
      await addLions([newCustomLion]);
      handleCloseModal();
    } catch (error) {
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
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
          <button onClick={deleteLastLion} disabled={isLoading}>마지막 아기 사자 삭제</button>
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
          <select id="filter-part" value={filterPart} onChange={(e: ChangeEvent<HTMLSelectElement>) => updateParams('part', e.target.value, 'all')}>
            <option value="all">전체</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>

          <label htmlFor="sort-order">정렬 </label>
          <select id="sort-order" value={sortOrder} onChange={(e: ChangeEvent<HTMLSelectElement>) => updateParams('sort', e.target.value, 'latest')}>
            <option value="latest">최신추가순</option>
            <option value="name">이름순</option>
          </select>

          <label htmlFor="search-input">검색 </label>
          <input
            id="search-input"
            type="text"
            placeholder="이름으로 검색"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateParams('search', e.target.value, '')}
          />
        </div>
      </header>

      {error ? (
        <div className="empty-state">
          <p>⚠️ 데이터를 불러오지 못했습니다: {error}</p>
        </div>
      ) : loading ? (
        <div className="empty-state">
          <p>⏳ 명단을 불러오는 중...</p>
        </div>
      ) : filteredLions.length === 0 ? (
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
                <LionCard
                  data={lion}
                  specialBorder={lion.isMe}
                  onClick={() => navigate(`/lions/${lion.id}`)}
                />
              </div>
            ))}
          </main>

          <hr />
        </>
      )}

      {/* 수동 추가 폼 모달 팝업 구조 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🦁 아기사자 수동 명단 추가</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>이름</label>
                <input type="text" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>파트</label>
                <select value={formData.part} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, part: e.target.value })}>
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                </select>
              </div>
              <div className="form-group">
                <label>한줄평</label>
                <input type="text" value={formData.quote} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, quote: e.target.value })} />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input type="email" value={formData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>깃허브 주소</label>
                <input type="text" value={formData.github} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, github: e.target.value })} />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input type="text" value={formData.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>보유 기술 (쉼표 구분)</label>
                <input type="text" placeholder="React, JavaScript" value={formData.skills} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, skills: e.target.value })} />
              </div>
              <div className="form-group">
                <label>상세 소개</label>
                <textarea value={formData.fullIntroduction} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, fullIntroduction: e.target.value })} />
              </div>
              <div className="form-group">
                <label>각오</label>
                <input type="text" value={formData.determination} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, determination: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-random-fill" onClick={fillFormWithRandom}>🎲 랜덤 값 채우기</button>
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>취소</button>
                <button type="submit" className="btn-submit" disabled={!isFormValid}>제출하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListPage;
