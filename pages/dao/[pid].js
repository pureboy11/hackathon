import { useRouter, withRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import DefenDAO from "../../components/data/TestDefenDAO.json";
import { useAccount, useSigner, useContract } from "wagmi";
import { NumericFormat } from "react-number-format";
import { useTimeoutFn } from "react-use";
import ConfirmModal from "../../components/ConfirmModal";
import CancelModal from "../../components/CancelModal";
import ClaimModal from "../../components/ClaimModal";
import NFTCollection from "../../components/data/NFTpuller.json";
import DefenDAOFactory from "../../components/data/TestDefenDAOFactory.json";

// offerPriceUnit -> 단위에요
// offerPriceUnit * 1 , offerPriceUnit * 2 .....
// 0.5, 1.0, 1.5 ......
// getAllOffers(price) price단위는 0.5, 1.0, 1.5 인듯

export default function DefenDaoDetail() {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const queryId = router.query;
    // console.log({ queryId: queryId });
    // console.log({ query: router.query });
    const chartRef = useRef(null);
    const [priceUnit, setPriceUnit] = useState(1);
    const [initPrice, setInitPrice] = useState(1);
    const [nftpuller, setNftpuller] = useState([]);
    const [myNFTList, setMyNFTList] = useState([]);
    const [claimableNFTs, setClaimableNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [navigate, setNavigate] = useState(1);
    const [bidModal, setBidModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [claimModal, setClaimModal] = useState(false);
    const [infoModal, setInfoModal] = useState(true);
    const [walletAsset, setwalletAsset] = useState("20.14124");
    const [inputTargetPrice, setInputTargetPrice] = useState(1);
    const [inputTicketCount, setInputTicketCount] = useState(10);
    const [, , setAutoChangeTime] = useTimeoutFn(() => setInfoModal(false), 5000);
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const defenDAOAddress = router.query.address;
    const defenDaoFactory = new ethers.Contract(
        "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
        DefenDAOFactory,
        provider
    );
    const { data: signer, isError, isLoading } = useSigner();
    const defenDAO = new ethers.Contract(defenDAOAddress, DefenDAO, provider);
    const tempImages = {
        8645: "https://i.seadn.io/gae/vK2eqcAtB4rO-8fsreMRgOI6QPO_qwxQHU76VuKhJlx3--VrG9CfcFzYj-lZj_FOCF6Y5TOawM3zpEf-jNdyhYOoDxxdv4EDrhez",
    };

    const [allUserData, setAllUserData] = useState({
        labels: [],
        datasets: [
            {
                label: "All user tickets",
                data: [],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
        totalTickets: 0,
        totalLiq: "",
    });
    const [myData, setMyData] = useState({
        labels: [],
        datasets: [
            {
                label: "My tickets",
                data: [],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
        totalTickets: 0,
        totalLiq: "",
    });

    const data = router.query.data;
    const initTicket = 10;

    async function sendtoBlock() {
        setLoading(true);
        const value = priceUnit * inputTicketCount;
        await signer.sendTransaction({
            to: defenDAO.address,
            value: ethers.utils.parseEther(value.toString()),
        });
        await defenDAO
            .connect(signer)
            .makeOffer(ethers.utils.parseEther(inputTargetPrice.toString()), inputTicketCount);
        await fetchOnChainData();
        setBidModal(false);
        setLoading(false);
    }

    async function sendtoBlockSell() {
        setLoading(true);
        await defenDAO
            .connect(signer)
            .cancelOffer(ethers.utils.parseEther(inputTargetPrice.toString()), inputTicketCount);
        await fetchOnChainData();
        setCancelModal(false);
        setLoading(false);
    }

    async function sendtoBlockClaim() {
        setLoading(true);
        const nftIdList = claimableNFTs.map((val) => val.id);
        //console.log(claimableNFTs);
        //console.log(nftIdList);
        await defenDAO.connect(signer).claimNFTs(nftIdList);
        await getClaimable();
        setClaimModal(false);
        setLoading(false);
    }

    const onChange = (event) => {
        setInputTargetPrice(event.target.value);
    };

    const onChangeTicket = (event) => {
        setInputTicketCount(event.target.value);
    };

    const initInfoModal = () => {
        setAutoChangeTime();
    };

    function roundDown(number, decimals) {
        decimals = decimals || 0;
        return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    // console.log({ inputTargetPrice: inputTargetPrice });
    // console.log(typeof inputTargetPrice);
    // console.log({ inputTicketCount: inputTicketCount });

    async function getClaimable() {
        const claimableList = [];

        if (isConnected) {
            //console.log("Claimable", await defenDAO.getClaimableNFTs(address));
            const claimable = await defenDAO.getClaimableNFTs(address);

            for (const [, nftId] of claimable.entries()) {
                if (nftId == 0) continue;

                claimableList.push({
                    id: Number(nftId),
                    img: tempImages[Number(nftId)],
                    name: router.query.name + "#" + Number(nftId),
                });
            }
        }
        setClaimableNFTs(claimableList);
    }

    async function getMyNFTList() {
        const myList = [];

        if (isConnected) {
            const NFTContract = new ethers.Contract(router.query.nftAddress, NFTCollection, provider);
            //console.log("Claimable", await defenDAO.getClaimableNFTs(address));
            const balance = await NFTContract.balanceOf(address);
            console.log("Balance", balance);

            for (let i = 0; i < balance; i++) {
                const nftId = await NFTContract.tokenOfOwnerByIndex(address, i);

                myList.push({
                    id: Number(nftId),
                    img: tempImages[Number(nftId)],
                    name: router.query.name + "#" + Number(nftId),
                });
            }
        }
        setMyNFTList(myList);
    }

    //NFT Fetch//
    async function generateNft() {
        const itemArray = [];
        // id image name
        setLoading(true);

        const recentSolds = await defenDaoFactory.getRecentSolds();
        //console.log({ recent: recentSolds });
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
            const buyer = sold[3];
            const contAddr = sold[4];
            const nftName = sold[5];
            const imgUrl = sold[6];

            //   const res = await fetch(
            //     `https://api.opensea.io/api/v1/asset/${nftAddr}/${nftId}`,
            //     options
            //   );
            //   const result = await res.json();
            if (contAddr === router.query.address) {
                itemArray.push({
                    id: nftId,
                    //img: result.image_url,
                    //name: result.name,
                    img: imgUrl,
                    name: nftName,
                    price: price,
                    address: contAddr,
                    claimer: buyer,
                });
            }
        }

        setNftpuller(itemArray);
        //console.log(itemArray);
        setLoading(false);
    }

    async function fetchOnChainData() {
        const aud = {
            labels: [],
            datasets: [
                {
                    label: "All user tickets",
                    data: [],
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
            totalTickets: 0,
            totalLiq: BigNumber.from(0),
        };
        const mud = {
            labels: [],
            datasets: [
                {
                    label: "My tickets",
                    data: [],
                    backgroundColor: "rgba(55, 99, 132, 0.9)",
                },
            ],
            totalTickets: 0,
            totalLiq: BigNumber.from(0),
        };

        const unit = ethers.utils.formatEther(await defenDAO.offerPriceUnit());
        const floorPrice = ethers.utils.formatEther(await defenDAO.curFloorPrice());
        setPriceUnit(Number(unit));
        setInitPrice(Number(floorPrice));
        setInputTargetPrice(Number(floorPrice));
        const len = Math.floor(floorPrice / unit);

        let liq = BigNumber.from(0);
        for (let i = len; i >= 1; i--) {
            const ticket = Number(await defenDAO.getAllOffers(ethers.utils.parseEther(unit).mul(i)));
            aud.labels.push(`${roundDown(unit * i, 5)} ETH`);
            aud.datasets[0].data.push(ticket);
            aud.totalTickets += ticket;
            liq = liq.add(ethers.utils.parseEther(unit).mul(i).mul(ticket).div(10));

            if (isConnected) {
                const myTickets = Number(await defenDAO.getUserOffers(address, ethers.utils.parseEther(unit).mul(i)));
                mud.labels.push(`${roundDown(unit * i, 5)} ETH`);
                mud.datasets[0].data.push(myTickets);
                mud.totalTickets += myTickets;
            }
        }
        aud.totalLiq = ethers.utils.formatEther(liq);

        setAllUserData(aud);
        //console.log(mud);
        setMyData(mud);
    }

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            console.log("CanvasRenderingContext2D", chart.ctx);
            console.log("HTMLCanvasElement", chart.canvas);
        }
        fetchOnChainData();
        generateNft();
        getClaimable();
        getMyNFTList();
    }, []);

    useEffect(() => {
        initInfoModal();
    }, [infoModal]);

    return (
        <>
            <TitleManager pageTitle="CollectionNAME" />
            <div className="dark:text-slate-300 ml-5 mt-5 pb-2 truncate ... w-96">{` DefenDAO > Collection
             > ${router.query.name} `}</div>
            {/* 위에서 내려오는 InfoModal */}
            {infoModal ? (
                <section className="fixed -top-2 left-1/3 w-[800px] h-12 mx-auto bg-green-700 dark:bg-green-900 text-slate-200 rounded-lg z-20 pt-4 flex items-center justify-center duration-500 transition-all animate-pulse ">
                    Defend the NFT price with separable tickets! ( 10 Tickets = 1 NFT )
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
            <div className="relative mx-3 lg:mx-20 mt-10">
                <section className="INFO mb-10">
                    <div className="grid grid-cols-6 ">
                        <div className="col-span-3">
                            <div className="flex items-center justify-start m-2">
                                <div className="rounded-full w-28 h-28 mr-4 mb-4">
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
                                    <div className="text-2xl font-semibold text-slate-400 dark:text-slate-400 ml-4 mt-2 font-pop">
                                        Floor Price : {router.query.floorPrice || "Loading"} ETH
                                    </div>
                                    <div className="text-md font-semibold text-slate-400 dark:text-slate-400 ml-4 font-pop">
                                        Avg :
                                        <NumericFormat
                                            className=""
                                            value={router.query.avgPrice || "Loading"}
                                            prefix={""}
                                            decimalScale={4}
                                            thousandSeparator=","
                                            displayType="text"
                                            suffix="ETH"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="border p-4 mr-4 mt-2">{allUserData.totalTickets} Tickets Total</div>
                                <div className="border p-4 mr-4 mt-2">TVL {allUserData.totalLiq} ETH</div>
                            </div>
                        </div>
                        <div className="col-span-3 flex justify-center absolute right-6 -top-20 space-x-16">
                            <div className="">
                                <div className="dark:bg-green-800 bg-green-400 pb-4 pt-2 translate-y-4 flex justify-center items-center">
                                    Latest DAO's Activity
                                </div>
                                <div className="bg-slate-50 dark:bg-gray-900 p-5 pt-8 gap-5 overflow-x-auto justify-start grid grid-flow-col items-center scroll-smooth w-[400px] h-68 relative">
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
                                                    <div className="flex flex-col asepct-square overflow-hidden items-center relative h-40">
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
                                                    <div className="ICON -mt-4 flex justify-end bg-slate-100 dark:bg-slate-700">
                                                        <span className="rounded-full z-10 mr-3 shadow-xl border-2 border-slate-200 ">
                                                            <svg
                                                                width="32"
                                                                height="32"
                                                                viewBox="0 0 90 90"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="cursor-pointer"
                                                            >
                                                                <path
                                                                    d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                                                                    fill="#2081E2"
                                                                />
                                                                <path
                                                                    d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                                                                    fill="white"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="TEXTBOX px-2 pt-2 bg-slate-100 dark:bg-slate-700 text-sm">
                                                        <div className="flex items-center pb-2">
                                                            <span className="block text-md font-semibold truncate ... whitespace-pre">
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

                            <div className="">
                                <div className="dark:bg-green-800 bg-green-400 pb-4 pt-2  translate-y-4 flex justify-center items-center">
                                    My NFT List
                                </div>
                                <div className="bg-slate-50 dark:bg-gray-900 p-5 pt-8 min-h-[300px] gap-5 overflow-x-auto justify-start grid grid-flow-col items-center scroll-smooth w-[400px] h-68 relative">
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
                                        myNFTList.map((mynft) => (
                                            <div key={mynft.id}>
                                                <div className="NFTCARDS relative overflow-hidden bg-inherit rounded-xl shadow-md transition-all mx-5 w-40">
                                                    <div className="flex flex-col asepct-square overflow-hidden items-center relative h-40">
                                                        {mynft.img !== null ? (
                                                            <Image
                                                                src={mynft.img}
                                                                alt="NFT Img"
                                                                className="object-cover absolute left-0 top-0 hover:scale-125 rounded-t-xl hover:rounded-t-xl group-hover:scale-125 transition-all duration-300"
                                                                width={160}
                                                                height={160}
                                                                priority="true"
                                                                unoptimized="true"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="ICON -mt-4 flex justify-end bg-slate-100 dark:bg-slate-700">
                                                        <span className="rounded-full z-10 mr-3 shadow-xl border-2 border-slate-200 ">
                                                            <svg
                                                                width="32"
                                                                height="32"
                                                                viewBox="0 0 90 90"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="cursor-pointer"
                                                            >
                                                                <path
                                                                    d="M90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0C69.8566 0 90 20.1486 90 45Z"
                                                                    fill="#2081E2"
                                                                />
                                                                <path
                                                                    d="M22.2011 46.512L22.3953 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M74.38 49.9149V52.8137C74.38 52.9801 74.2783 53.1281 74.1304 53.1928C73.2242 53.5812 70.1219 55.0052 68.832 56.799C65.5402 61.3807 63.0251 67.932 57.4031 67.932H33.949C25.6362 67.932 18.9 61.1727 18.9 52.8322V52.564C18.9 52.3421 19.0803 52.1618 19.3023 52.1618H32.377C32.6359 52.1618 32.8255 52.4022 32.8024 52.6565C32.7099 53.5072 32.8671 54.3764 33.2693 55.167C34.0461 56.7435 35.655 57.7283 37.3934 57.7283H43.866V52.675H37.4673C37.1391 52.675 36.9449 52.2959 37.1345 52.0277C37.2038 51.9214 37.2824 51.8104 37.3656 51.6856C37.9713 50.8257 38.8358 49.4895 39.6958 47.9684C40.2829 46.9421 40.8516 45.8463 41.3093 44.746C41.4018 44.5472 41.4758 44.3438 41.5497 44.1449C41.6746 43.7936 41.804 43.4653 41.8965 43.1371C41.9889 42.8597 42.0629 42.5684 42.1369 42.2956C42.3542 41.3617 42.4467 40.3723 42.4467 39.3459C42.4467 38.9437 42.4282 38.523 42.3912 38.1207C42.3727 37.6815 42.3172 37.2423 42.2617 36.8031C42.2247 36.4147 42.1554 36.031 42.0814 35.6288C41.9889 35.0416 41.8595 34.4591 41.7115 33.8719L41.6607 33.65C41.5497 33.2478 41.4573 32.864 41.3278 32.4618C40.9626 31.1996 40.5418 29.9698 40.098 28.8186C39.9362 28.3609 39.7512 27.9217 39.5663 27.4825C39.2935 26.8213 39.0161 26.2203 38.7619 25.6516C38.6324 25.3927 38.5214 25.1569 38.4105 24.9165C38.2857 24.6437 38.1562 24.371 38.0268 24.112C37.9343 23.9132 37.8279 23.7283 37.754 23.5434L36.9634 22.0824C36.8524 21.8836 37.0374 21.6478 37.2546 21.7079L42.2016 23.0487H42.2155C42.2247 23.0487 42.2294 23.0533 42.234 23.0533L42.8859 23.2336L43.6025 23.437L43.866 23.511V20.5706C43.866 19.1512 45.0034 18 46.4089 18C47.1116 18 47.7496 18.2866 48.2073 18.7536C48.665 19.2206 48.9517 19.8586 48.9517 20.5706V24.935L49.4787 25.0829C49.5204 25.0968 49.562 25.1153 49.599 25.143C49.7284 25.2401 49.9133 25.3835 50.1491 25.5591C50.3341 25.7071 50.5329 25.8874 50.7733 26.0723C51.2495 26.4561 51.8181 26.9508 52.4423 27.5194C52.6087 27.6628 52.7706 27.8107 52.9185 27.9587C53.723 28.7076 54.6245 29.5861 55.4845 30.557C55.7249 30.8297 55.9607 31.1071 56.2011 31.3984C56.4415 31.6943 56.6958 31.9856 56.9177 32.2769C57.209 32.6652 57.5233 33.0674 57.7961 33.4882C57.9256 33.687 58.0735 33.8904 58.1984 34.0892C58.5497 34.6209 58.8595 35.1711 59.1554 35.7212C59.2802 35.9755 59.4097 36.2529 59.5206 36.5257C59.8489 37.2608 60.1078 38.0098 60.2742 38.7588C60.3251 38.9206 60.3621 39.0963 60.3806 39.2535V39.2904C60.436 39.5124 60.4545 39.7482 60.473 39.9886C60.547 40.756 60.51 41.5235 60.3436 42.2956C60.2742 42.6239 60.1818 42.9336 60.0708 43.2619C59.9598 43.5763 59.8489 43.9045 59.7056 44.2143C59.4282 44.8569 59.0999 45.4996 58.7115 46.1006C58.5867 46.3225 58.4388 46.5583 58.2908 46.7802C58.129 47.016 57.9626 47.238 57.8146 47.4553C57.6112 47.7327 57.3939 48.0239 57.172 48.2828C56.9732 48.5556 56.7697 48.8284 56.5478 49.0688C56.2381 49.434 55.9422 49.7808 55.6324 50.1137C55.4475 50.331 55.2487 50.5529 55.0452 50.7517C54.8464 50.9736 54.643 51.1724 54.4581 51.3573C54.1483 51.6671 53.8894 51.9075 53.6721 52.1063L53.1635 52.5733C53.0896 52.638 52.9925 52.675 52.8908 52.675H48.9517V57.7283H53.9079C55.0175 57.7283 56.0716 57.3353 56.9223 56.6141C57.2136 56.3598 58.485 55.2594 59.9876 53.5997C60.0384 53.5442 60.1032 53.5026 60.1771 53.4841L73.8668 49.5265C74.1211 49.4525 74.38 49.6467 74.38 49.9149Z"
                                                                    fill="white"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="TEXTBOX px-2 pt-2 bg-slate-100 dark:bg-slate-700 text-sm">
                                                        <div className="flex items-center pb-2">
                                                            <span className="block text-md font-semibold truncate ... whitespace-pre">
                                                                {mynft.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex text-lg items-center pb-4">
                                                            <span className="block text-sm font-medium truncate ... whitespace-pre">
                                                                {mynft.id}
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
                    </div>
                </section>
                {/* Navigation */}
                <div className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <div className="space-x-5">
                        <button
                            className={`inline-block p-4 rounded-t-lg  text-lg ${
                                navigate === 1 ? "dark:bg-gray-700 bg-gray-200" : null
                            } `}
                            onClick={() => setNavigate(1)}
                        >
                            Pool Value
                        </button>
                        <button
                            className={`inline-block p-4 rounded-t-lg text-lg ${
                                navigate === 2 ? "dark:bg-gray-700 bg-gray-200" : null
                            } `}
                            onClick={() => setNavigate(2)}
                        >
                            My Bids
                        </button>
                    </div>
                </div>
                {/* Controller */}
                <section className="lg:grid lg:grid-cols-4">
                    <div className="col-span-3 m-4 h-[300px] lg:h-[650px]">
                        {navigate === 2 ? (
                            <Chart data={myData} className="" />
                        ) : (
                            <Chart data={allUserData} className="" />
                        )}
                    </div>
                    <div className="col-span-1 m-4 lg:h-[650px] rounded-lg grid grid-row-8">
                        <div className="px-4 title-text mt-5">Bidding Area</div>
                        <div className="row-span-6 p-2">
                            <div className="controller-minibox h-84">
                                <div className="flex justify-between">
                                    <div className="font-def font-extrabold text-xl text-gray-600 dark:text-gray-400 flex items-center">
                                        Target Price
                                    </div>
                                    <div className="flex justify-end items-center p-2">
                                        <div className="flex relative">
                                            <NumericFormat
                                                className="py-2 pr-16 text-slate-800 text-right 
                                           rounded-lg text-lg shadow-md focus:outline-none font-def
                                           dark:bg-gray-300  dark:text-black w-60"
                                                value={inputTargetPrice}
                                                onChange={onChange}
                                                placeholder="Enter your target price."
                                                decimalScale={6}
                                                thousandSeparator=","
                                                displayType="input"
                                                type="number"
                                                step={priceUnit}
                                            />
                                            <div className="absolute right-2 top-1/4 flex items-center mr-2 text-slate-600">
                                                <span>ETH</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div className="font-def font-extrabold text-xl text-gray-600 dark:text-gray-400 flex items-center">
                                        Number of Tickets
                                    </div>
                                    <div className="flex justify-end items-center p-2">
                                        <div className="flex relative">
                                            <NumericFormat
                                                className="py-2 pr-24 text-slate-800 text-right 
                                           rounded-lg text-lg shadow-md focus:outline-none font-def
                                           dark:bg-gray-300 dark:text-black w-60"
                                                value={inputTicketCount}
                                                onChange={onChangeTicket}
                                                placeholder="10 Tickets = 1 NFT"
                                                decimalScale={0}
                                                thousandSeparator=","
                                                displayType="input"
                                                // type="number"
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
                                                        className="w-5 h-5"
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
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M18 12H6"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="absolute right-6 top-1/4 flex items-center mr-2 text-slate-600">
                                                <span>Tickets</span>
                                            </div>
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
                                <div className="">
                                    <div className="mt-10 flex justify-end items-center text-xl p-2">
                                        <NumericFormat
                                            className=""
                                            value={priceUnit * inputTicketCount}
                                            prefix={""}
                                            decimalScale={5}
                                            thousandSeparator=","
                                            displayType="text"
                                        />{" "}
                                        ETH
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
                                <button
                                    className="confirmBtn px-6 py-3 text-lg font-def"
                                    onClick={() => setCancelModal(true)}
                                >
                                    Sell
                                </button>
                                <button
                                    className="confirmBtn px-6 py-3 text-lg font-def"
                                    onClick={() => setBidModal(true)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                        <div className="px-4 title-text mt-5">Claimable NFT</div>
                        <div className="row-span-1 mb-5 px-2">
                            <div className="controller-minibox overflow-y-auto p-5 space-y-4 h-40">
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
                                    claimableNFTs.map((nftList) => (
                                        <div
                                            className="NFTCARDS relative overflow-hidden rounded-xl shadow-md h-32 grid grid-cols-7 bg-slate-100 dark:bg-slate-700"
                                            key={nftList.id}
                                        >
                                            <div className="col-span-2 asepct-square overflow-hidden">
                                                {nftList.img !== null ? (
                                                    <Image
                                                        src={nftList.img}
                                                        alt="NFT Img"
                                                        className="absolute top-0 bottom-5 object-cover rounded-t-xl"
                                                        width={128}
                                                        height={128}
                                                        priority="true"
                                                        unoptimized="true"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="col-span-5 pt-5">
                                                <div className="">
                                                    <span className="font-def text-lg font-semibold truncate ... whitespace-pre">
                                                        {nftList.name}
                                                    </span>
                                                </div>
                                                {/* <div className="flex text-lg justify-end items-center mt-5 mb-2 mr-4">
                            <span className="block text-lg text-white font-medium truncate ... whitespace-pre bg-slate-800 p-2 rounded-lg">
                              {nftList.price} ETH
                            </span>
                          </div> */}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex justify-end mt-5 gap-4 mr-4">
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
                        sendtoBlock={sendtoBlock}
                        loading={loading}
                        priceUnit={priceUnit}
                    />
                )}
                {/* cancel Modal  */}
                {!cancelModal ? null : (
                    <CancelModal
                        inputTargetPrice={inputTargetPrice}
                        inputTicketCount={inputTicketCount}
                        setInputTargetPrice={setInputTargetPrice}
                        setInputTicketCount={setInputTicketCount}
                        cancelModal={cancelModal}
                        setCancelModal={setCancelModal}
                        sendtoBlock={sendtoBlockSell}
                        loading={loading}
                        priceUnit={priceUnit}
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
                        claimableNFTs={claimableNFTs}
                        sendtoBlock={sendtoBlockClaim}
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
