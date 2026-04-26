const btnShowForm = document.querySelector('.btn-add'); // 아기 사자 추가 버튼
const btnHideForm = document.getElementById('btn-hide-form');
const formContainer = document.getElementById('form-container');
const lionForm = document.querySelector('.lion-form');
const cardWrapper = document.querySelector('.card-wrapper'); 

// 폼 보여주기/숨기기
btnShowForm.addEventListener('click', () => {
    formContainer.style.display = 'block';
});

btnHideForm.addEventListener('click', () => {
    formContainer.style.display = 'none';
});

// 카드 추가 로직 (중복 없이 하나만!)
lionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const errorMessages = document.querySelectorAll('.error-msg');
    errorMessages.forEach(msg => msg.style.display = 'none');

    const inputs = [
        { id: 'input-Name', msg: '이름을 입력하세요.' },
        { id: 'input-Email', msg: '이메일을 입력하세요.' },
        { id: 'input-Phone', msg: '전화번호를 입력하세요.' },
        { id: 'input-Website', msg: 'git주소를 입력하세요.' }
    ]

    let isValid = true;

    inputs.forEach(input => {
        const target = document.getElementById(input.id);
        if(!target.value.trim()){
            //에러 메세지 표시
            const errorSpan = target.parentElement.querySelector('.error-msg');
            if(errorSpan){
                errorSpan.innerText = input.msg;
                errorSpan.style.display = 'block';
            }
            isValid = false;
        }
    });

    //이메일 형식 확인
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // 전화번호: 010-0000-0000 형식 (하이픈 필수)
    phone: /^010-\d{3,4}-\d{4}$/,
    // 웹사이트: http:// 또는 https://로 시작하는 URL
    website: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
    };
    // [전화번호 형식 검사]
    const phoneInput = document.getElementById('input-Phone');
    if (phoneInput.value.trim() && !patterns.phone.test(phoneInput.value)) {
        showError(phoneInput, "010-0000-0000 형식으로 입력하세요.");
        isValid = false;
    }

    // [웹사이트 형식 검사]
    const webInput = document.getElementById('input-Website');
    if (webInput.value.trim() && !patterns.website.test(webInput.value)) {
        showError(webInput, "올바른 URL(https://...) 형식을 입력하세요.");
        isValid = false;
    }

    // [이메일 형식 검사]
    const emailInput = document.getElementById('input-Email');
    if (emailInput.value.trim() && !patterns.email.test(emailInput.value)) {
        showError(emailInput, "올바른 이메일 형식을 입력하세요.");
        isValid = false;
    }

    // 보조 함수: 에러 메시지를 표시하는 공통 로직
    function showError(target, message) {
        const errorSpan = target.parentElement.querySelector('.error-msg');
        if (errorSpan) {
            errorSpan.innerText = message;
            errorSpan.style.display = 'block';
        }
    }
    //하나라도 비어 있으면 중단
    if (!isValid) return;

    const name = document.getElementById('input-Name').value;
    const part = document.getElementById('input-Part').value; 
    const email = document.getElementById('input-Email').value;
    const phone = document.getElementById('input-Phone').value; 
    const github = document.getElementById('input-Website').value;
    const intro = document.getElementById('input-intro').value;
    const specific = document.getElementById('input-specific').value;
    const skillsRaw = document.getElementById('input-skills').value; 

    //관심 기술 목록 처리 (쉼표로 구분)
    const skillsArray = skillsRaw.split(',').map(skill => skill.trim());
    const skillsListHTML = skillsArray.map(skill => `<li>${skill}</li>`).join('');

    //요약 카드 생성 (위쪽 영역)
    const newCard = document.createElement('div');
    newCard.className = 'container';
    newCard.innerHTML = `
        <img src="baby_lion.jpg" alt="프로필" width="400px" height="400px">
        <h3>아기사자 ${name}</h3>
        <h4>${part.toUpperCase()} DEVELOPER</h4>
        <span class="badge">${part}</span>
        <p>${intro}</p>
    `;
    cardWrapper.appendChild(newCard);

    //상세 카드 생성 (하단 상세 정보 영역)
    const detailWrapper = document.querySelector('.detail-wrapper');
    const newDetailCard = document.createElement('div');
    newDetailCard.className = 'detail-card'; 
    
    newDetailCard.innerHTML = `
        <div class="detail-header">
            <h2>${name}</h2>
            <p class="detail-part">${part}</p>
            <p class="detail-track">LION TRACK</p>
        </div>
        <div class="detail-body">
            <section>
                <h4>자기소개</h4>
                <p>${intro}</p>
            </section>
            <section>
                <h4>연락처</h4>
                <ul>
                    <li>EMAIL: ${email}</li>
                    <li>PHONE: ${phone}</li>
                    <li>GITHUB: <a href="${github}" target="_blank">${github}</a></li>
                </ul>
            </section>
            <section>
                <h4>BASIC SKILLS</h4>
                <ul>
                    ${skillsListHTML}
                </ul>
            </section>
            <section>
                <h4>DETERMINATION</h4>
                <p>${specific}</p>
        </div>
    `;
    detailWrapper.appendChild(newDetailCard);

    //뒷정리
    alert(`${name} 사자 등록 완료!`);
    lionForm.reset();
    formContainer.style.display = 'none';
    updateCount();
});

// 인원수 업데이트 함수
function updateCount() {
    const countSpan = document.querySelector('.total-count');
    const currentCards = document.querySelectorAll('.card-wrapper .container').length;
    countSpan.innerText = `총 ${currentCards}명`;
}

// 삭제 버튼 선택 
const btnDelete = document.querySelector('.btn-delete');

btnDelete.addEventListener('click', () => {
    const cardWrapper = document.querySelector('.card-wrapper');
    const detailWrapper = document.querySelector('.detail-wrapper');

    const lastCard = cardWrapper.lastElementChild;
    const lastDetail = detailWrapper.lastElementChild;

    if (lastCard && lastDetail) {
        if (confirm("정말로 마지막 아기 사자를 삭제하시겠습니까?")) {
            cardWrapper.removeChild(lastCard);
            detailWrapper.removeChild(lastDetail);
            
            alert("삭제되었습니다.");
            
            // 5. 삭제 후 인원수 업데이트 호출
            updateCount(); 
        }
    } else {
        alert("삭제할 사자가 없습니다!");
    }
});
