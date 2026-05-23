import { useParams, useNavigate } from 'react-router-dom';
import { initialLions } from './data/lion';

function DetailPage({ lions }) {
    const { id } = useParams(); // URL의 :id추출
    const navigate = useNavigate();

    const lion = lions.find(l => String(l.id) === id); 


    //해당 id가 없을 경우 방어 처리
    if (!lion) {
        return <p>해당 아기사자를 찾을 수 없습니다.</p>
    }

    return (
        <div className="container">
            <button onClick={() => navigate('/')}>← 목록으로 돌아가기</button>

            <div className="detail-card">
                <h2>아기사자 {lion.name}</h2>
                <h4>{lion.part} DEVELOPER</h4>

                <div className="introduction">
                    <h3>INTRODUCTION</h3>
                    <p>{lion.intro || lion.fullIntroduction || lion.quote}</p>
                </div>

                <div className="contact">
                    <h3>CONTACT</h3>
                    <ul>
                        <li>EMAIL: {lion.contact?.email || lion.contact?.EMAIL}</li>
                        <li>GITHUB: <a href={lion.contact?.github || lion.contact?.GITHUB}>{lion.contact?.github || lion.contact?.GITHUB}</a></li>
                        <li>PHONE: {lion.contact?.phone || lion.contact?.PHONE}</li>
                    </ul>
                </div>

                <div className="list">
                    <h3>BASIC SKILLS</h3>
                    <ul>
                        {lion.skills?.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>

                <div className="determination">
                    <h3>DETERMINATION</h3>
                    <p>{lion.determination || lion.determin || "멋진 사자가 되겠습니다!"}</p>
                </div>
            </div>
        </div>
    )
}

export default DetailPage;