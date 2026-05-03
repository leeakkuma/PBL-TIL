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
function createLionCard(data) {
    const card = document.createElement('div');
    card.className = 'my-card';
    card.innerHTML = `
        <h3>${data.name}</h3>
        <p class="badge">${data.part}</p>
        <p>${data.intro}</p>
    `;
    cardWrapper.prepend(card); // 최신순 배치를 위해 앞에 추가
    updateCount();
}

function updateCount() {
    totalCountEl.innerText = cardWrapper.children.length;
}

// 비동기 데이터 로드
async function fetchLions(count = 1) {
    try {
        updateStatus("불러오는 중...", true);
        const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${count}`);
        if (!response.ok) throw new Error("네트워크 오류");
        const users = await response.json();

        users.forEach(user => {
            createLionCard({
                name: user.name,
                part: ['Frontend', 'Backend', 'Design'][Math.floor(Math.random() * 3)],
                intro: `${user.company.name} 소속 아기사자입니다.` // 반영
            });
        });
        updateStatus("준비 완료");
    } catch (error) {
        updateStatus("실패: " + error.message);
        document.getElementById('btn-retry').style.display = 'inline';
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
    fetchLions(5);
};
document.getElementById('btn-add-form').onclick = () => {
    document.getElementById('form-container').style.display = 'block';
};
document.getElementById('btn-close-form').onclick = () => {
    document.getElementById('form-container').style.display = 'none';
};
