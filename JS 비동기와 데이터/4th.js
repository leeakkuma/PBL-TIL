// 요소 가져오기
const cardWrapper = document.getElementById('card-wrapper');
const detailWrapper = document.getElementById('detail-wrapper');
const statusText = document.getElementById('async-status');
const totalCountEl = document.getElementById('total-count');

//초기 인원수 계산(페이지 로드 시)
window.addEventListener('DOMContentLoaded', () => {
    updateCount(); // HTML에 미리 적힌 9명을 먼저 카운트합니다.
});

// 상태 관리 함수
function updateStatus(message, isLoading = false) {
    statusText.innerText = message;
    document.querySelectorAll('button').forEach(btn => btn.disabled = isLoading);
}

// 카드 생성 함수 (공통 사용)
function createLionCard(data, isRandom = false) {
    const card = document.createElement('div');
    // 랜덤 카드라면 'random-card' 클래스를 추가로 붙임
    card.className = isRandom ? 'my-card random-card' : 'my-card';
    
    card.innerHTML = `
        <span class="badge">${data.part}</span>
        <h3>${data.name}</h3>
        <p>${data.intro}</p>
    `;
    
    cardWrapper.appendChild(card);
    updateCount();
}

function updateCount() {
    const totalCountEl = document.getElementById('total-count');
    const currentCards = document.querySelectorAll('#card-wrapper .my-card');
    
    totalCountEl.innerText = currentCards.length;
}
window.onload = () => {
    updateCount(); 
}

// 비동기 데이터 로드
async function fetchLions(count = 1) {
    try {
        updateStatus("불러오는 중...", true);
        const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${count}`);
        const users = await response.json();

        users.forEach(user => {
            // 두 번째 인자로 true를 넘겨 'random-card' 클래스가 붙게 함
            createLionCard({
                name: user.name,
                part: ['Frontend', 'Backend', 'Design'][Math.floor(Math.random() * 3)],
                intro: `${user.company.name}에서 온 사자입니다.`
            }, true); 
        });
        updateStatus("준비 완료");
    } catch (error) {
        updateStatus("실패: " + error.message);
    }
}

// 랜덤 폼 채우기
document.getElementById('btn-fill-random').addEventListener('click', async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();
    const user = users[Math.floor(Math.random() * users.length)];

    document.getElementById('input-Name').value = user.name;
    document.getElementById('input-Email').value = user.email;
    document.getElementById('input-Website').value = user.website;
    document.getElementById('input-Intro').value = `저는 ${user.company.catchPhrase}를 좋아합니다.`;
});

// 실시간 검색
document.getElementById('search-input').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.my-card');
    let hasResult = false;

    cards.forEach(card => {
        const name = card.querySelector('h3').innerText.toLowerCase();
        const isMatch = name.includes(keyword);
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) hasResult = true;
    });

    document.getElementById('empty-state').style.display = hasResult ? 'none' : 'block';
});

// 이벤트 연결
document.getElementById('btn-random-1').onclick = () => fetchLions(1);
document.getElementById('btn-random-5').onclick = () => fetchLions(5);
document.getElementById('btn-refresh').onclick = () => {
    // 1. 기존에 추가된 '랜덤 카드'들만 싹 지우기
    const randomCards = document.querySelectorAll('.random-card');
    randomCards.forEach(card => card.remove());
    
    // 2. 새로운 랜덤 데이터 5개 불러오기
    fetchLions(5); 
};
document.getElementById('btn-add-form').onclick = () => {
    document.getElementById('form-container').style.display = 'block';
};
document.getElementById('btn-close-form').onclick = () => {
    document.getElementById('form-container').style.display = 'none';
};
