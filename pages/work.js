import TitleManager from "../components/TitleManager";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function work() {
  const today = new Date();
  const targetDate = new Date("2022-12-04T09:00:00+0900");
  const dis = targetDate.getTime() - today.getTime();
  const min1 = 1000 * 60;

  const d = Math.floor((dis % (min1 * 60)) / min1);
  const h = Math.floor(dis / (min1 * 60 * 24));
  const m = Math.floor((dis % (min1 * 60 * 24)) / (min1 * 60));
  const s = Math.floor((dis % min1) / 1000);

  const [day, setDay] = useState(h);
  const [hour, setHour] = useState(m);
  const [minutes, setMinutes] = useState(d);
  const [seconds, setSeconds] = useState(s);

  // useEffect(() => {
  //   const countdown = setInterval(() => {
  //     if (parseInt(seconds) > 0) setSeconds(parseInt(seconds) - 1);

  //     if (parseInt(seconds) === 0) {
  //       if (parseInt(minutes) === 0) {
  //         if (parseInt(hour) === 0) {
  //           if (parseInt(day) === 0) {
  //             clearInterval(countdown);
  //           } else {
  //             setDay(parseInt(day) - 1);
  //             setHour(23);
  //             setMinutes(59);
  //             setSeconds(59);
  //           }
  //         } else {
  //           setHour(parseInt(hour) - 1);
  //           setMinutes(59);
  //           setSeconds(59);
  //         }
  //       } else {
  //         setMinutes(parseInt(minutes) - 1);
  //         setSeconds(59);
  //       }
  //     }
  //   }, 1000);
  //   return () => clearInterval(countdown);
  // }, [day, hour, minutes, seconds, today]);

  return (
    <>
      <TitleManager pageTitle="work" />
      <div className="container h-screen mx-auto">
        <section id="dDayCalendar" className="mx-5">
          <Link
            href="https://www.encode.club/evmoscovalent-hack"
            target="_blank"
          >
            <div className="text-lg font-extrabold">
              Evmos-Covalent #OneMillionWallets Hackathon
            </div>
          </Link>
          <Link
            href="https://www.encode.club/metaverse-hackathon"
            target="_blank"
          >
            <div className="text-lg font-extrabold">Metaverse Hackathon</div>
          </Link>
          <div className="mx-20">
            <div className="text-right mt-5">
              D- day : {day}일 {hour} 시간 {minutes} 분 {seconds} 초
            </div>
            <div className="w-full bg-slate-300 h-2 rounded-md  mt-5">
              <div className="flex justify-between pt-4 relative">
                <div>
                  <div className="flex flex-col text-left">
                    <span>시작일</span>
                    <div className="text-center bg-slate-300 dark:bg-slate-700 rounded-lg p-2 text-sm">
                      11월 4일 (금)
                    </div>
                  </div>
                </div>
                <button className="">
                  <button className="absolute -top-1 bg-orange-400 rounded-full w-5 h-5"></button>
                  <button className="absolute -top-1 bg-orange-400 rounded-full w-5 h-5 animate-ping"></button>
                  <span>Stage1</span>
                </button>
                <button>
                  <button className="absolute -top-1 bg-orange-400 rounded-full w-5 h-5"></button>
                  <span>Stage2</span>
                </button>
                <button>
                  <button className="absolute -top-1 bg-orange-400 rounded-full w-5 h-5"></button>
                  <span>Stage3</span>
                </button>
                <button>
                  <button className="absolute -top-1 bg-orange-400 rounded-full w-5 h-5"></button>
                  <span>Stage4</span>
                </button>
                <button className="flex flex-col text-right">
                  <span>제출</span>
                  <div className="text-center bg-slate-300 dark:bg-slate-700 rounded-lg p-2 text-sm">
                    12월 4일 (일)
                  </div>
                </button>
              </div>
              <div className="mt-20 font-extrabold text-2xl"> To do list</div>
              <div>
                <li>메인 페이지 꾸미기</li>
                <li>DAO 내부 페이지 꾸미기</li>
                <li>컬렉션별 그래프 그리기</li>
                <li>최저가 거래 알림, 채팅 기능? 넣기</li>
                <li>
                  컬렉션 내의 NFT 가치 구분(같은 컬렉션이라도 가치가 많이 다른
                  케이스)
                </li>
                <li>거래 히스토리 정보</li>
                <li>오픈씨 API 컬렉션 등 기본 정보 가져오기</li>
                <li>오픈씨 API 가격 정보 가져오기</li>
                <li> 오픈씨 정보 끊어서 받아오기</li>
                <li>최저가 리스트 올라온 거 캐치</li>
                <li>최저가 NFT 구매하기</li>
                <li>DAO 멤버 중 임의의 1명 선택</li>
                <li>해당 멤버에게 NFT SmartContnract 거래 이행</li>
                <li>
                  {" "}
                  스마트 컨트랙 거래 프로세스 정리. 누가 1차 구매할지? 금액
                  지불은 어느 시점에 할지? 등{" "}
                </li>
                <li>
                  {" "}
                  최초 DAO 가입시 해당 NFT 가치만큼 코인 묶어두는 Smart Contract{" "}
                </li>
                <li>거래량이 충분한 컬렉션 리스트 추리기</li>
                <li>DAO 가입자 수를 기반으로 랭킹 정리</li>
                <li>리스크 대비책 고민 : 뉴스로 인한 가치 급락 등</li>
                <li> 프로젝트 이름 정하기</li>
                <li> 백엔드 서버 구성하기</li>
                <li> 로그인 구현</li>
                <li> 로그인 계정의 DAO 가입 현황 등 필요한 정보 보여주기</li>
                <li> 표 리스트 제목 클릭하면 내림차순/오름차순 정렬</li>
                <li> 인풋에 컬렉션, NFT명 등 검색하면 필터 적용</li>
                <li> 각종 애니메이션 및 호버 효과 등 넣기</li>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
