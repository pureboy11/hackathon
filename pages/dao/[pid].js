import { useRouter, withRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { NumericFormat } from "react-number-format";

// project name -> 가져올수있음
// floor price -> 가져올수있음
// offerPriceUnit -> 단위에요
// offerPriceUnit * 1 , offerPriceUnit * 2 .....
// 0.5, 1.0, 1.5 ......
// getAllOffers(price) price단위는 0.5, 1.0, 1.5 인듯

export default function DefenDaoDetail() {
    const router = useRouter();
    const queryId = router.query;
    // console.log({ queryId: queryId });
    // console.log({ query: router.query });
    const chartRef = useRef(null);
    const [navigate, setNavigate] = useState("1");
    const [bidModal, setBidModal] = useState(false);
    const [claimModal, setClaimModal] = useState(false);
    const [infoModal, setInfoModal] = useState(true);
    const [walletAsset, setwalletAsset] = useState("20.14124");
    const [inputValue, setInputValue] = useState(!router.query.floorPrice ? "null" : router.query.floorPrice / 10);
    const [inputTicketCount, setInputTicketCount] = useState(
        !router.query.floorPrice ? "null" : (router.query.floorPrice / 10) * walletAsset
    );

    const data = router.query.data;
    console.log(data);
    const sendtoBlock = () => {
        return <div>"Great"</div>;
    };

    const onChange = (event) => {
        setInputValue(event.target.value);
    };

    const onChangeTicket = (event) => {
        setInputTicketCount(event.target.value);
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            console.log("CanvasRenderingContext2D", chart.ctx);
            console.log("HTMLCanvasElement", chart.canvas);
        }
    }, []);

    return (
        <>
            <TitleManager pageTitle="CollectionNAME" />
            <div className="dark:text-slate-300 ml-5 mt-5 pb-2 truncate ... w-96">{` DefenDAO > Collection
             > ${router.query.name} `}</div>

            {/* 위에서 내려오는 InfoModal */}
            {infoModal ? (
                <section className="fixed -top-2 left-1/3 w-[800px] h-12 mx-auto bg-green-900 rounded-lg z-20 pt-4 flex items-center justify-center duration-500 transition-all ">
                    Defend the NFT price with 10 tickets! ( 10 Tickets = 1 NFT)
                    <button
                        className="absolute right-3 top-3 hover:-rotate-90 duration-300"
                        onClick={() => setInfoModal(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </section>
            ) : null}
            {/* 제목 및 기본 정보 */}
            <div className="relative mx-3 lg:mx-20 h-screen mt-10">
                <section className="INFO h-36 mb-10">
                    <div className="grid grid-cols-6 ">
                        <div className="col-span-3">
                            <div className="flex items-center justify-start m-2">
                                <div className="rounded-full w-20 h-20 mr-4">
                                    {router.query.img !== null ? (
                                        <>
                                            <Image
                                                src={router.query.img}
                                                width={200}
                                                height={200}
                                                unoptimized="true"
                                                alt="CollectionImg"
                                                className=" rounded-xl"
                                                aria-placeholder="CollectionImg"
                                            />
                                        </>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="text-4xl mb-auto font-semibold dark:text-slate-50">
                                        {router.query.name}
                                    </div>
                                    <div className="text-2xl font-semibold text-slate-400 mt-2">
                                        Floor Price : {router.query.floorPrice || "Loading"} ETH
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 flex gap-4 justify-end mr-10">
                            <div className="controller-minibox">
                                <div className="bg-slate-200 dark:bg-slate-700 px-4 py-1 rounded-xl text-center text-slate-700 dark:text-slate-200 ">
                                    Total volume
                                </div>
                                <div className="px-4 py-1 h-10 flex items-center justify-center mt-2">
                                    a,b,c,d,e Tickets value sum
                                </div>
                            </div>
                            <div className="controller-minibox">
                                <div className="bg-slate-200 dark:bg-slate-700 px-4 py-1 rounded-xl text-center text-slate-700 dark:text-slate-200">
                                    Tickets count
                                </div>
                                <div className="px-4 py-1 h-10 flex items-center justify-center mt-2">🏷 14,243</div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Navigation */}
                <section className="gap-5">
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg ${
                                    navigate === !"1"
                                        ? "bg-none"
                                        : "text-blue-600 focus:bg-gray-100 active focus:text-blue-500"
                                } `}
                                onClick={() => setNavigate(1)}
                            >
                                Summary
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg ${
                                    navigate === !"2"
                                        ? "bg-none"
                                        : "text-blue-600 focus:bg-gray-100 active focus:text-blue-500"
                                } `}
                                onClick={() => setNavigate(2)}
                            >
                                My Bids
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg ${
                                    navigate === !"0"
                                        ? "bg-none"
                                        : "text-blue-600 focus:bg-gray-100 active focus:text-blue-500"
                                } `}
                                onClick={() => setNavigate(0)}
                            >
                                History
                            </button>
                        </li>
                    </ul>
                </section>
                {/* Controller */}
                <section className="lg:grid lg:grid-cols-4">
                    <div className="col-span-3 m-4 h-[300px] lg:h-[650px]">
                        <Chart className="" />
                    </div>
                    <div className="col-span-1 m-4 lg:h-[650px] rounded-lg grid grid-row-8">
                        <div className="row-span-6 p-2">
                            <div className="dark:text-gray-500 text-gray-600 text-2xl font-bold px-2">Place a bid</div>
                            <div className="controller-minibox h-80">
                                <div className="mt-2 flex justify-between px-4 py-2">
                                    <div className="flex items-center justify-center text-xl font-bold">
                                        Target Price <span> {} </span>
                                    </div>
                                    <div className="flex relative">
                                        <input
                                            type=""
                                            id="inputPrice"
                                            className="py-2 pr-10 h-[52px] text-slate-800 border border-gray-300 text-right 
                                                 bg-gray-50 rounded-lg text-lg shadow-md focus:outline-none 
                                                   ease-linear transition-all duration-150  focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder={"Enter your target price."}
                                            onChange={onChange}
                                            value={inputValue}
                                            suffix="ETH"
                                        />
                                        <div className="absolute right-0 flex flex-col">
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputValue(inputValue * 1.05)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 6v12m6-6H6"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputValue(inputValue * 0.95)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between px-4 py-2">
                                    <div className="flex items-center justify-center text-xl font-bold">
                                        number of tickets <span> {} </span>
                                    </div>
                                    <div className="flex relative">
                                        <input
                                            type=""
                                            id="inputPrice"
                                            className="py-2 pr-10 h-[52px] text-slate-800 border border-gray-300 text-right 
                                                 bg-gray-50 rounded-lg text-lg shadow-md focus:outline-none 
                                                   ease-linear transition-all duration-150  focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder={"Ticket"}
                                            onChange={onChangeTicket}
                                            value={inputTicketCount}
                                        />
                                        <div className="absolute right-0 flex flex-col">
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputTicketCount(inputTicketCount + 1)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 6v12m6-6H6"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputTicketCount(inputTicketCount - 1)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10"> </div>
                                <div className="flex justify-end">
                                    <div className="flex justify-end col-span-3 gap-2 mr-4">
                                        <button
                                            className="col-span-1 ratio-box "
                                            onClick={() => setInputValue(walletAsset / 4)}
                                        >
                                            25%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() => setInputValue(walletAsset / 2)}
                                        >
                                            50%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() => setInputValue((walletAsset * 3) / 4)}
                                        >
                                            75%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() => setInputValue(walletAsset)}
                                        >
                                            100%
                                        </button>
                                    </div>
                                    <div className="col-span-1"></div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
                                <button className="confirmBtn text-2xl" onClick={() => setBidModal(true)}>
                                    🧾
                                </button>
                                <button className="confirmBtn px-6 py-3 text-lg" onClick={() => setBidModal(true)}>
                                    <span className="text-2xl">🏷</span> Make Offer :{" "}
                                    <NumericFormat
                                        className=""
                                        value={inputValue * inputTicketCount}
                                        prefix={""}
                                        decimalScale={3}
                                        thousandSeparator=","
                                        displayType="text"
                                    />{" "}
                                    ETH
                                </button>
                            </div>
                        </div>
                        <div className="dark:text-gray-500 text-gray-600 text-2xl font-bold px-4">Claim NFT</div>
                        <div className="row-span-1 mb-5 px-2">
                            <div className="controller-minibox h-40"> my asset : {walletAsset} ETH</div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
                                <button className="confirmBtn text-2xl" onClick={() => setClaimModal(true)}>
                                    🧾
                                </button>
                                <button className="confirmBtn px-6 py-3 text-lg" onClick={() => setClaimModal(true)}>
                                    Claim
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Bid Modal  */}
                {!bidModal ? null : (
                    <section>
                        <div
                            className="fixed inset-0 bg-black opacity-80 duration-300 z-30"
                            onClick={() => setBidModal(false)}
                        ></div>

                        <div className="absolute bottom-1/2 right-8 bg-slate-800 rounded-lg h-60 w-96 shadow-xl p-4 z-50">
                            Confirm bid
                            <div className="relative"></div>
                            <button
                                className="absolute right-3 top-3 hover:-rotate-90 duration-300"
                                onClick={() => setBidModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="flex justify-end mt-5 gap-4">
                                <div className="mt-4 bg-slate-700 p-4 w-40 rounded-xl mx-auto">
                                    <NumericFormat
                                        className="text-white text-right"
                                        value={inputTicketCount}
                                        prefix={""}
                                        decimalScale={3}
                                        thousandSeparator=","
                                        displayType="text"
                                        suffix="Tickets"
                                    />{" "}
                                </div>
                                <div className="mt-4 bg-slate-700 p-4 w-40 rounded-xl mx-auto">
                                    <NumericFormat
                                        className="text-white text-right"
                                        value={inputValue}
                                        prefix={""}
                                        decimalScale={3}
                                        thousandSeparator=","
                                        displayType="text"
                                        suffix="ETH"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4">
                                <button
                                    className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl"
                                    onClick={() => setBidModal(false)}
                                >
                                    cancel
                                </button>
                                <button
                                    className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl"
                                    onClick={() => sendtoBlock()}
                                >
                                    Confirm bid
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps({ query: queryId }) {
    return {
        props: {
            queryId,
        },
    };
}
