import { useRouter, withRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// project name -> 가져올수있음
// floor price -> 가져올수있음
// offerPriceUnit -> 단위에요
// offerPriceUnit * 1 , offerPriceUnit * 2 .....
// 0.5, 1.0, 1.5 ......
// getAllOffers(price) price단위는 0.5, 1.0, 1.5 인듯

export default function DefenDaoDetail() {
    const router = useRouter();
    console.log(router);
    const chartRef = useRef(null);
    const [navigate, setNavigate] = useState("1");
    const data = router.query.data;
    console.log(data);

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
                                className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 focus:text-blue-500 text-lg"
                                onClick={() => setNavigate(1)}
                            >
                                Summary
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 text-lg"
                                onClick={() => setNavigate(2)}
                            >
                                My Bids
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300 text-lg"
                                onClick={() => setNavigate(0)}
                            >
                                History
                            </button>
                        </li>
                        {/* <li>
                            <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
                                Disabled
                            </a>
                        </li> */}
                    </ul>
                    {/* <button className="p-4 mr-4  mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
                        Summary
                    </button>
                    <button className="p-4 mr-4  mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
                        My Bids
                    </button>
                    <button className="p-4 mr-4 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
                        Recent Liq
                    </button> */}
                </section>
                <section className="lg:grid lg:grid-cols-6">
                    <div className="col-span-4 m-4 h-[300px] lg:h-[600px]">
                        <Chart className="" />
                    </div>
                    <div className="col-span-2 border border-slate-200 m-4 lg:h-[600px] grid grid-row-6 rounded-lg">
                        <div className="row-span-3 border-white border">Bidding area</div>
                        <div className="row-span-2 border-white border grid grid-cols-3">
                            <div className="col-span-1">1</div>
                            <div className="col-span-1">2</div>
                            <div className="col-span-1">3</div>
                        </div>
                        <div className="row-span-1 border-white border">Available for Withdrawal</div>
                    </div>
                </section>
            </div>
        </>
    );
}
