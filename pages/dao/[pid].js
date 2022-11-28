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
    const [inputValue, setInputValue] = useState(!router.query.floorPrice ? "null" : router.query.floorPrice);
    const [walletAsset, setwalletAsset] = useState("20.14124");

    const data = router.query.data;
    console.log(data);
    const sendtoBlock = () => {
        return <div>"Great"</div>;
    };

    const onChange = (event) => {
        setInputValue(event.target.value);
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
            <div className="dark:text-slate-300 ml-5 mt-5 pb-2">{` ETH > Collect
             > TAG `}</div>
            <div className="relative mx-3 lg:mx-20 h-screen">
                <section className="INFO h-36 mb-10">
                    <div className="grid grid-cols-6">
                        <div className="col-span-4">
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
                                    <div className="text-2xl font-semibold text-slate-400">
                                        Floor Price : {router.query.floorPrice || "Loading"} ETH
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div>Members 숫자</div>
                            <div>Ticket 숫자</div>
                        </div>
                    </div>
                </section>
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
                <section className="lg:grid lg:grid-cols-7">
                    <div className="col-span-5 m-4 h-[300px] lg:h-[600px]">
                        <Chart className="" />
                    </div>
                    <div className="col-span-2 m-4 lg:h-[600px] grid grid-row-6 rounded-lg">
                        <div className="row-span-4 p-2 ">
                            <div className=" mt-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-gray-900/10 bg-gray-300/10 text-gray-800 dark:text-gray-400 h-60 p-4">
                                <div className="dark:text-gray-200 text-gray-600 text-xl font-bold border-b dark:border-slate-600 border-slate-200 p-2">
                                    Place a bid
                                </div>
                                <div className="h-28 mt-2 grid grid-cols-4">
                                    <div className="col-span-2">asdf</div>
                                    <div className="col-span-2">
                                        <input
                                            type="search"
                                            id="inputPrice"
                                            className="p-3 text-slate-800 border border-gray-300
                                                 bg-gray-50 rounded-lg text-sm shadow-md focus:outline-none w-full
                                                   ease-linear transition-all duration-150  focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder={"Enter your target price."}
                                            onChange={onChange}
                                            value={inputValue}
                                        />
                                        <div className="flex justify-end">
                                            <button type="button" onClick={() => setInputValue(inputValue * 0.95)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                >
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                                                </svg>
                                            </button>
                                            <button type="button" onClick={() => setInputValue(inputValue * 1.05)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M12 6v12m6-6H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4">
                                    <div className="flex justify-start col-span-3 gap-4">
                                        <button
                                            className="col-span-1 border border-white rounded-xl w-24 py-3 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => setInputValue(walletAsset / 4)}
                                        >
                                            25%
                                        </button>
                                        <button
                                            className="col-span-1 border border-white rounded-xl w-24 py-3 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => setInputValue(walletAsset / 2)}
                                        >
                                            50%
                                        </button>
                                        <button
                                            className="col-span-1 border border-white rounded-xl w-24 py-3 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => setInputValue((walletAsset * 3) / 4)}
                                        >
                                            75%
                                        </button>
                                        <button
                                            className="col-span-1 border border-white rounded-xl w-24 py-3 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            onClick={() => setInputValue(walletAsset)}
                                        >
                                            100%
                                        </button>
                                    </div>
                                    <div className="col-span-1"></div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4">
                                <button className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl">H</button>
                                <button
                                    className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl"
                                    onClick={() => setBidModal(true)}
                                >
                                    🏷 Make Offer :{" "}
                                    <NumericFormat
                                        className="text-white"
                                        value={inputValue}
                                        prefix={""}
                                        decimalScale={3}
                                        thousandSeparator=","
                                        displayType="text"
                                    />{" "}
                                    ETH
                                </button>
                            </div>
                        </div>
                        <div className="row-span-1 grid grid-cols-2 p-2 gap-4">
                            <div className=" mt-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-gray-900/10 bg-gray-300/10 text-gray-800 dark:text-gray-400 h-full p-4">
                                <div className="dark:text-gray-200 text-gray-600 text-xl font-bold border-b dark:border-slate-600 border-slate-200 p-2">
                                    CurFloor Price
                                </div>
                                <div className="p-4">{router.query.floorPrice || "Loading"} ETH</div>
                            </div>
                            <div className=" mt-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-gray-900/10 bg-gray-300/10 text-gray-800 dark:text-gray-400 h-full p-4">
                                <div className="dark:text-gray-200 text-gray-600 text-xl font-bold border-b dark:border-slate-600 border-slate-200 p-2">
                                    My Assets
                                </div>
                                <div className="p-4">Total : {walletAsset} ETH </div>
                            </div>
                        </div>
                        <div className="row-span-1 flex items-center justify-center p-2"># text text text</div>
                    </div>
                </section>
                {!bidModal ? null : (
                    <>
                        <div
                            className="fixed inset-0 bg-black opacity-80 duration-300"
                            onClick={() => setBidModal(false)}
                        ></div>

                        <div className="absolute top-1/4 right-8 bg-slate-800 rounded-lg h-52 w-96 shadow-xl p-4">
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
                            <div className="mt-4 bg-slate-700 p-4 w-40 rounded-xl mx-auto">
                                <NumericFormat
                                    className="text-white"
                                    value={inputValue}
                                    prefix={""}
                                    decimalScale={3}
                                    thousandSeparator=","
                                    displayType="text"
                                />{" "}
                                ETH
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
                    </>
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
