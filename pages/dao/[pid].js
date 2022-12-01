import { useRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";
import { useState } from "react";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import ConfirmModal from "../../components/ConfirmModal";
import ClaimModal from "../../components/ClaimModal";
import { ethers } from "ethers";
import NFTCollection from "../../components/data/NFTpuller.json";
import DefenDAOFactory from "../../components/data/TestDefenDAOFactory.json";
import DefenDAO from "../../components/data/TestDefenDAO.json";

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
    const [nftpuller, setNftpuller] = useState([]);
    const [loading, setLoading] = useState(true);
    const [navigate, setNavigate] = useState(1);
    const [bidModal, setBidModal] = useState(false);
    const [claimModal, setClaimModal] = useState(false);
    const [infoModal, setInfoModal] = useState(true);
    const [walletAsset, setwalletAsset] = useState("20.14124");
    const [inputTargetPrice, setInputTargetPrice] = useState(router.query.floorPrice / 10);
    const [inputTicketCount, setInputTicketCount] = useState(10);
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const defenDaoFactory = new ethers.Contract(
        "0x707531c9999AaeF9232C8FEfBA31FBa4cB78d84a",
        DefenDAOFactory,
        provider
    );

    const data = router.query.data;

    console.log(data);
    console.log(queryId);
    const initPrice = router.query.floorPrice / 10;
    const initTicket = 10;
    const sendtoBlock = () => {
        return <div>"Great"</div>;
    };

    //NFT Fetch//
    async function generateNft() {
        const itemArray = [];
        const osArray = [];
        // id image name
        setLoading(true);

        const recentSolds = await defenDaoFactory.getRecentSolds();

        for (const [index, sold] of recentSolds.entries()) {
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            };

            const nftAddr = sold[0];
            const nftId = Number(sold[1]);
            const price = ethers.utils.formatEther(sold[2]);
            const claimer = sold[3];

            const res = await fetch(`https://api.opensea.io/api/v1/asset/${nftAddr}/${nftId}`, options);
            const result = await res.json();
            itemArray.push({
                id: nftId,
                img: result.image_url,
                name: result.name,
                price: price,
                collection: result.collection,
            });
        }

        setNftpuller(itemArray);
        setLoading(false);
    }

    console.log(nftpuller);

    const onChange = (event) => {
        setInputTargetPrice(event.target.value);
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
        generateNft();
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
                                    <div className="text-4xl mb-auto font-semibold dark:text-slate-50 font-pop">
                                        {router.query.name}
                                    </div>
                                    <div className="text-2xl font-semibold text-slate-400 mt-2 font-pop">
                                        Floor Price : {router.query.floorPrice || "Loading"} ETH
                                    </div>
                                </div>
                            </div>
                            <div className="flex ">
                                <div className="border p-4 mr-4">Total Ticket</div>
                                <div className="border p-4 mr-4">Total Volume</div>
                            </div>
                        </div>
                        <div className="col-span-3 flex justify-end absolute right-0 -top-16">
                            <div className="bg-slate-100 dark:bg-slate-900/40 rounded-xl py-4 grid grid-flow-col">
                                {loading ? (
                                    <>
                                        <div className="flex justify-center items-center py-10 p-2 animate-pulse font-def">
                                            <svg
                                                aria-hidden="true"
                                                className=" w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                            <span>Loading...</span>
                                        </div>
                                    </>
                                ) : (
                                    nftpuller.map((nftList) => (
                                        <div key={nftList.id}>
                                            <div className="NFTCARDS relative overflow-hidden bg-inherit rounded-xl shadow-md transition-all mx-5 w-40">
                                                <div className="flex flex-col asepct-square overflow-hidden items-center w-40 relative h-40">
                                                    {nftList.img !== null ? (
                                                        <Image
                                                            src={nftList.img}
                                                            alt="NFT Img"
                                                            className="object-cover absolute left-0 top-0 hover:scale-125 rounded-t-xl hover:rounded-t-xl group-hover:scale-125 transition-all duration-300"
                                                            width={160}
                                                            height={160}
                                                            priority="true"
                                                            unoptimized="true"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="ICON -mt-3 flex justify-end bg-slate-100 dark:bg-slate-700">
                                                    <span className="bg-slate-400 text-md dark:bg-slate-600 rounded-2xl px-2 z-10 mr-3 shadow-xl border border-slate-100">
                                                        ETH
                                                    </span>
                                                </div>
                                                <div className="TEXTBOX px-2 py-1 bg-slate-100 dark:bg-slate-700 text-sm">
                                                    <div className="flex text-xs items-center">
                                                        <span className="block text-lg font-semibold truncate ... whitespace-pre">
                                                            {nftList.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex text-lg items-center pb-4">
                                                        <span className="block text-sm font-medium truncate ... whitespace-pre">
                                                            {nftList.price} ETH
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Navigation */}
                <section className="gap-5">
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg 
                                } `}
                                onClick={() => setNavigate(1)}
                            >
                                Summary
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg 
                                } `}
                                onClick={() => setNavigate(2)}
                            >
                                My Bids
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 rounded-t-lg focus:dark:bg-gray-800 text-lg 
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
                            <div className="controller-minibox h-84">
                                <div className="font-def font-extrabold text-2xl text-gray-600 dark:text-gray-400 mr-auto">
                                    Ticket Price
                                </div>
                                <div className="mt-2 flex justify-end items-center p-2">
                                    <div className="flex relative">
                                        <NumericFormat
                                            className="py-2 pr-12 h-[52px] text-slate-800 text-right 
                                            rounded-lg text-lg shadow-md focus:outline-none font-def
                                              dark:bg-gray-300  dark:text-black"
                                            value={inputTargetPrice}
                                            placeholder="Enter your target price."
                                            decimalScale={3}
                                            thousandSeparator=","
                                            displayType="input"
                                            suffix="ETH"
                                        />
                                        <div className="absolute right-0 flex flex-col">
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputTargetPrice(inputTargetPrice * 1.05)}
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
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 6v12m6-6H6"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="plusBtn"
                                                type="button"
                                                onClick={() => setInputTargetPrice(inputTargetPrice * 0.95)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end col-span-4 gap-2 mb-7 mt-1 mr-2">
                                    <button className="ratio-box " onClick={() => setInputTargetPrice(initPrice)}>
                                        0%
                                    </button>
                                    <button
                                        className="ratio-box "
                                        onClick={() => setInputTargetPrice(initPrice * 0.97)}
                                    >
                                        -3%
                                    </button>
                                    <button
                                        className="ratio-box "
                                        onClick={() => setInputTargetPrice(initPrice * 0.95)}
                                    >
                                        -5%
                                    </button>
                                    <button className="ratio-box" onClick={() => setInputTargetPrice(initPrice * 0.93)}>
                                        -7%
                                    </button>
                                    <button className="ratio-box" onClick={() => setInputTargetPrice(initPrice * 0.9)}>
                                        -10%
                                    </button>
                                    <button className="ratio-box" onClick={() => setInputTargetPrice(initPrice * 0.8)}>
                                        -20%
                                    </button>
                                </div>

                                <div className="font-def font-extrabold text-2xl text-gray-600 dark:text-gray-400 mr-auto mt-10">Number of Tickets</div>
                                <div className="mt-2 flex justify-end items-center p-2">
                                    <div className="flex relative">
                                        <NumericFormat
                                            className="py-2 pr-12 h-[52px] text-slate-800 text-right 
                                           rounded-lg text-lg shadow-md focus:outline-none font-def
                                           dark:bg-gray-300  dark:text-black"
                                            value={inputTicketCount}
                                            placeholder="10 Tickets = 1 NFT"
                                            decimalScale={0}
                                            thousandSeparator=","
                                            displayType="input"
                                            suffix="Tickets"
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
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <div className="flex justify-end col-span-4 gap-2 mr-2">
                                        <button
                                            className="col-span-1 ratio-box "
                                            onClick={() =>
                                                setInputTicketCount(((walletAsset / inputTargetPrice) * 1) / 4)
                                            }
                                        >
                                            25%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() =>
                                                setInputTicketCount(((walletAsset / inputTargetPrice) * 1) / 2)
                                            }
                                        >
                                            50%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() =>
                                                setInputTicketCount(((walletAsset / inputTargetPrice) * 3) / 4)
                                            }
                                        >
                                            75%
                                        </button>
                                        <button
                                            className="col-span-1 ratio-box"
                                            onClick={() => setInputTicketCount(walletAsset / inputTargetPrice)}
                                        >
                                            max
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
                                <button className="confirmBtn text-2xl" onClick={() => setBidModal(true)}>
                                    🧾
                                </button>
                                <button
                                    className="confirmBtn px-6 py-3 text-lg font-def"
                                    onClick={() => setBidModal(true)}
                                >
                                    Make Offer :{" "}
                                    <NumericFormat
                                        className=""
                                        value={inputTargetPrice * inputTicketCount}
                                        prefix={""}
                                        decimalScale={3}
                                        thousandSeparator=","
                                        displayType="text"
                                    />{" "}
                                    ETH
                                </button>
                            </div>
                        </div>
                        <div className="px-4 title-text mt-5">Claim NFT</div>
                        <div className="row-span-1 mb-5 px-2">
                            <div className="controller-minibox h-40"> my asset : {walletAsset} ETH</div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
                                <button className="confirmBtn text-2xl" onClick={() => setClaimModal(true)}>
                                    🧾
                                </button>
                                <button
                                    className="confirmBtn px-6 py-3 text-lg font-def"
                                    onClick={() => setClaimModal(true)}
                                >
                                    Claim
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Bid Modal  */}
                {!bidModal ? null : (
                    <ConfirmModal
                        inputTargetPrice={inputTargetPrice}
                        inputTicketCount={inputTicketCount}
                        setInputTargetPrice={setInputTargetPrice}
                        setInputTicketCount={setInputTicketCount}
                        bidModal={bidModal}
                        setBidModal={setBidModal}
                    />
                )}
                {/* claim Modal  */}
                {!claimModal ? null : (
                    <ClaimModal
                        inputTargetPrice={inputTargetPrice}
                        inputTicketCount={inputTicketCount}
                        setInputTargetPrice={setInputTargetPrice}
                        setInputTicketCount={setInputTicketCount}
                        claimModal={claimModal}
                        setClaimModal={setClaimModal}
                    />
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
