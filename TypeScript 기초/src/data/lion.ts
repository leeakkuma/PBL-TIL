import lionImage1 from "../assets/baby_lion.jpg";
import lionImage2 from "../assets/1.jpg";
import lionImage3 from "../assets/2.jpg";
import lionImage4 from "../assets/3.jpg";
import lionImage5 from "../assets/4.jpg";
import lionImage6 from "../assets/5.jpg";
import lionImage7 from "../assets/6.jpg";
import lionImage8 from "../assets/7.jpg";
import lionImage9 from "../assets/8.jpg";

// 중첩 객체는 별도로 정의
export interface Contact {
    email?: string;
    EMAIL?: string;
    github?: string;
    GITHUB?: string;
    phone?: string;
    PHONE?: string;
}

export interface Lion  {
    id: number | string;
    name: string;
    part: string;
    partKey?: string;
    track?: string;
    quote?: string;
    intro?: string;
    fullIntroduction?: string;
    contact: Contact;
    skills: string[];
    determin?: string;
    determination?: string;
    image: string | null; // 이미지가 없을 수도 있음
    isMe: boolean;
}

// 타입 적용
export const initialLions: Lion[] = [
    {
        id: 1,
        name: "이지은",
        part: "FRONTEND DEVELOPER",
        track: "HUFSLION",
        quote: "매사에 노력하고자 하는 아기사자 이지은입니다",
        intro: "저는 스스로가 정한 길을 부끄럽게 하지 않기 위해 멋쟁사자처럼에 가입했습니다. 제 각오가 흐려지지 않도록 열심히 하겠습니다",
        contact: {
            EMAIL: "inginging@lion.com",
            GITHUB: "https://github.com/inginging",
            PHONE: "010-1111-2222",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "시간이 얼마가 걸리든, 저다운 멋쟁이 사자가 되겠습니다",
        image: lionImage1,
        isMe: true,
    },
    {
        id: 2,
        name: "홍길동",
        part: "FRONTEND",
        quote: "멋진 디자인을 많이 만들고픈 아기사자 홍길동입니다",
        intro: "평소에 다양한 어플리케이션을 사용하면서 개발 환경을 연구해왔습니다. 더 시용성 있는 개발 환경을 구축해 나가겠습니다.",
        contact: {
            EMAIL: "lionhong@example.com",
            GITHUB: "https://github.com/hong",
            PHONE: "010-2222-3333",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "열심히 노력하겠습니다.",
        image: lionImage2,
        isMe: false,
    },
    {
        id: 3,
        name: "김경식",
        part: "FRONTEND",
        quote: "컴포넌트 단위 설계에 흥미를 느껴 지원한 아기사자 김경식입니다",
        intro: "이번에 HTML과 CSS를 처음 배우게 되었습니다. 부족한만큼 열심히 공부하고 노력해서 실력을 향상시키겠습니다.",
        contact: {
            EMAIL: "lionkim@example.com",
            GITHUB: "https://github.com/kim",
            PHONE: "010-3333-4444",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "부족한만큼 열심히 하겠습니다!",
        image: lionImage3,
        isMe: false,
    },
    {
        id: 4,
        name: "박철수",
        part: "FRONTEND",
        quote: "데이터 흐름을 명확히 하는 개발을 지향하는 아기사자 박철수입니다",
        intro: "외부 활동으로 백엔드의 경험을 쌓아왔습니다. 이번에는 프론트엔드에 지원하여 더 다양한 관점을 가지고 개발할 수 있도록 노력하고자 합니다. 잘 부탁드립니다.",
        contact: {
            EMAIL: "lionpark@example.com",
            GITHUB: "https://github.com/park",
            PHONE: "010-4444-5555",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "뒤처지지 않게 노력하겠습니다.",
        image: lionImage4,
        isMe: false,
    },
    {
        id: 5 ,
        name: "신미나",
        part: "BACKEND",
        quote: "안정적인 서버를 구축하고자 하는 아기사자 신미나입니다",
        intro: "대외활동을 통해 기초적인 백엔드 지식을 쌓았습니다. 스스로 실전 경험이 부족하다고 판단하여 지원하게 되었습니다. 열심히 하겠습니다.",
        contact: {
            EMAIL: "lionshin@example.com",
            GITHUB: "https://github.com/shin",
            PHONE: "010-5555-6666",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "자신있게 임하겠습니다.",
        image: lionImage5,
        isMe: false,
    },
    {
        id: 6,
        name: "구현민",
        part: "BACKEND",
        quote: "사용자 관점에서 개발하고자 하는 아기사자 구현민입니다",
        intro: "저는 한 번도 개발에 대해 전문적으로 배워본 적이 없습니다. 하지만 누구보다 개발에 관심이 있고, 열정이 있습니다. 열심히하겠습니다.",
        contact: {
            EMAIL: "liongoo@example.com",
            GITHUB: "https://github.com/goo",
            PHONE: "010-6666-7777",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "열정만은 뒤쳐지지 않습니다. 잘 부탁드립니다.",
        image: lionImage6,
        isMe: false,
    },
    {
        id: 7,
        name: "김지우",
        part: "BACKEND",
        quote: "실용성 있는 개발을 목표로 하는 아기사자 김지우입니다",
        intro: "저는 어렸을 때부터 누군가의 도움이 되었을 때 큰 뿌듯함을 느꼈습니다. 그래서 개발을 통해 누군가에게 도움이 되고 싶다는 생각이 들어 지원하게 되었습니다.",
        contact: {
            EMAIL: "lionwoo@example.com",
            GITHUB: "https://github.com/woo",
            PHONE: "010-7777-8888",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "꿈을 위해 노력하겠습니다.",
        image: lionImage7,
        isMe: false,
    },
    {
        id: 8,
        name: "황영미",
        part: "BACKEND",
        quote: "더 쉽게 사용할 수 있는 웹 서비스를 개발하는 아기사자 황영미입니다",
        intro: "저는 사람을 가르치는 것에 흥미가 있습니다. 또 평소에 재미를 느끼고 꾸준히 공부해왔던 개발과 이 꿈을 합쳐 사람들에게 개발과 관련된 내용들을 가르치고 싶어졌습니다. 더 많은 지식을 더 쉽게 명확하게 가르치기 위해 이곳에 왔습니다.",
        contact: {
            EMAIL: "hwang@example.com",
            GITHUB: "https://github.com/hwang",
            PHONE: "010-8888-9999",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "개발을 더 많은 사람들에게 전달하겠습니다.",
        image: lionImage8,
        isMe: false,
    },
    {
        id: 9,
        name: "고승미",
        part: "DESIGN",
        quote: "보기 좋은 디자인을 위해 노력하는 아기사자 고승미입니다",
        intro: "저는 어렸을 때부터 꾸준히 디자인을 공부해왔습니다. 더 다양한 디자인을 통해 사람들에게 긍정적인 영향을 주고 싶다는 생각이 들어 지원하게 되었습니다. 열심히 하겠습니다.",
        contact: {
            EMAIL: "mimi@example.com",
            GITHUB: "https://github.com/mimi",
            PHONE: "010-1234-5678",
        },
        skills: ["HTML/CSS(in process)", "JAVASCRIPT", "C++"],
        determin: "여러분의 결과물에 멋진 디자인을 더하겠습니다.",
        image: lionImage9,
        isMe: false,
    }
]

export const LionsdetailCard: Lion[] = [

]