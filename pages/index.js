import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TitleManager from "../components/TitleManager";
import axios from "axios";
import { ethers } from "ethers";
import { useTimeoutFn } from "react-use";
import NFTCollection from "../components/data/NFTpuller.json";
import DefenDAOFactory from "../components/data/TestDefenDAOFactory.json";
import DefenDAO from "../components/data/TestDefenDAO.json";

export default function Home() {
    const router = useRouter();
    const [defendaoData, setdefendaData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [searchbar, setSearchbar] = useState("");
    const [collectionFetching, setCollectionFetching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nftpuller, setNftpuller] = useState([]);
    const [guideBook, setGuideBook] = useState(1);
    const [, , setAutoChangeTime] = useTimeoutFn(() => setGuideBook((guideBook + 1) % 3), 5000);
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const defenDaoFactory = new ethers.Contract(
        "0x707531c9999AaeF9232C8FEfBA31FBa4cB78d84a",
        DefenDAOFactory,
        provider
    );

    //Collection Fetch//
    async function getCollection() {
        setLoading(true);
        let tempData = [];
        let osData = [];
        let statData = [];
        let floorPrice = [];


        const collist = await defenDaoFactory.getAllCollections();
        const slugs = await defenDaoFactory.getAllSlugs();

        //opensea//
        for (const [index, slug] of slugs.entries()) {
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            };

            const res = await fetch("https://api.opensea.io/api/v1/collection/" + slug, options);
            const stat = await fetch("https://api.opensea.io/api/v1/collection/" + slug + "/stats", options);
            const result = await res.json();
            const stat_result = await stat.json()
            osData[index] = result;
            statData[index] = stat_result

            
        }

        for (const [index, collectionAddress] of collist.entries()) {
            const defenDAO = new ethers.Contract(collectionAddress, DefenDAO, provider);

            floorPrice[index] = ethers.utils.formatEther(await defenDAO.curFloorPrice());
        }

        //set DAOdata//
        for (let i = 0; i < collist.length; i++) {
            tempData.push({
                id: i,
                slug: slugs[i],
                address: collist[i],
                opensea: osData[i],
                stats: statData[i],
                floorPrice: floorPrice[i],
            });
        }

        setdefendaData(tempData);
        setLoading(false);
        console.log(tempData);
    }

    //NFT Fetch//
    async function generateNft() {
        const itemArray = [];
        // id image name
        setLoading(true);

        const recentSolds = await defenDaoFactory.getRecentSolds();
        console.log({ recent: recentSolds });
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
            });
        }

        setNftpuller(itemArray);
        console.log(itemArray);
        setLoading(false);
    }

    const onChange = (event) => {
        setSearchbar(event.target.value);
    };

    const autoChangeGuideBook = () => {
        setAutoChangeTime();
    };

    useEffect(() => {
        autoChangeGuideBook();
    }, [guideBook]);

    useEffect(() => {
        getCollection();
        generateNft();
    }, []);

    return (
        <>
            <TitleManager pageTitle="home" />
            <div className="mx-3">
                <section className="text-gray-600 body-font relative">
                    <div className="INFO lg:flex items-center justify-center mt-2 container mx-auto relative">
                        <div className="sm:mt-16 mt-10 mb-10 mx-2 p-5 flex justify-center items-center bg-slate-200 dark:bg-slate-800 rounded-xl w-full h-40">
                            <div className="m-3 text-indigo-400 uppercase font-pop text-3xl font-semibold z-10 absolute right-4 top-12">
                                {guideBook % 3 === 1 ? (
                                    <>
                                        <button className="rounded-full bg-indigo-500 w-2 h-2 ml-2 mr-2 hover:scale-110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 mr-2 hover:scale-110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 hover:scale-110 transition duration-300 transform"></button>
                                    </>
                                ) : guideBook % 3 === 2 ? (
                                    <>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 ml-2 mr-2 hover:scale-110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-500 w-2 h-2 mr-2 hover:scale-110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 hover:scale-105 transition duration-300 transform"></button>
                                    </>
                                ) : guideBook % 3 === 0 ? (
                                    <>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 ml-2 mr-2 hover:scale-e110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-300 w-2 h-2 mr-2 hover:scale-110 transition duration-300 transform"></button>
                                        <button className="rounded-full bg-indigo-500 w-2 h-2 hover:scale-110 transition duration-300 transform"></button>
                                    </>
                                ) : null}
                                {/* <div className="bg-slate-600 w-40 h-40 absolute left-1/2 rotate-45"></div> */}
                            </div>
                            {guideBook === 1 ? (
                                <section className="section1">
                                    <div className="items-center">
                                        <div className="text-xl font-semibold leading-relaxed text-slate-200">
                                            We are the DAO defending NFT prices.
                                        </div>
                                    </div>
                                </section>
                            ) : guideBook === 2 ? (
                                <section className="section2">
                                    <div className="items-center">
                                        <div className="text-xl font-semibold leading-relaxed text-slate-200">
                                            One of the DAO members will purchase the NFT that come as a quick sale with
                                            randomly.
                                        </div>
                                    </div>
                                </section>
                            ) : guideBook === 0 ? (
                                <section className="section3">
                                    <div className="items-center">
                                        <div className="text-xl font-semibold leading-relaxed text-slate-200">
                                            3 page comment (우리 서비스 3 step 인지 시키기!)
                                        </div>
                                    </div>
                                </section>
                            ) : null}
                        </div>
                        <div className="sm:absolute left-10 bottom-5">
                            <Image
                                src="/Defendao_Logo.png"
                                width="120"
                                height="120"
                                alt="Logo"
                                className="m-10 mx-auto w-auto h-auto "
                                priority="true"
                            />
                        </div>
                    </div>
                </section>
                <section className="mx-auto container sm:p-4 p-2 mb-10">
                    <p className="text-xl sm:text-3xl font-extrabold m-2">Latest Transfers</p>
                    <div className="border-2 dark:border-slate-800 border-slate-100 rounded-lg p-6 overflow-x-auto w-full grid grid-flow-col gap-8 shadow-md dark:shadow-slate-600 shadow-slate-200 scroll-smooth">
                        {loading ? (
                            <>
                                <div className="flex justify-center items-center py-10 p-2 animate-pulse">
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
                            nftpuller.map((nftList, id) => (
                                <Link
                                    key={id}
                                    href={{
                                        pathname: `/dao/${nftList.name}`,
                                        query: {
                                            id: nftList.id,
                                            name: nftList.name,
                                            price: nftList.price,
                                            nftData: JSON.stringify(nftList),
                                            data: JSON.stringify(defendaoData),
                                        },
                                    }}
                                    as={`/dao/${nftList.name}`.replace(/%20/g, "")}
                                >
                                    <div
                                        className="NFTCARDS relative hover:shadow-xl dark:hover:shadow-slate-700 dark:hover:shadow-lg overflow-hidden bg-inherit rounded-xl shadow-md transition-all cursor-pointer group w-52"
                                        key={nftList.id}
                                    >
                                        <div className="flex flex-col asepct-square overflow-hidden items-center">
                                            {nftList.img !== null ? (
                                                <Image
                                                    src={nftList.img}
                                                    alt="NFT Img"
                                                    className="object-cover block hover:scale-125 rounded-t-xl hover:rounded-t-xl group-hover:scale-125 transition-all duration-300"
                                                    width={250}
                                                    height={250}
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
                                        <div className="TEXTBOX px-2 py-1 space-y-2 bg-slate-100 dark:bg-slate-700">
                                            <div className="flex text-xs items-center">
                                                <span className="block text-lg font-semibold truncate ... whitespace-pre">
                                                    {nftList.name}
                                                </span>
                                            </div>
                                            <div className="flex text-lg items-center pb-7">
                                                <span className="block text-sm font-medium truncate ... whitespace-pre">
                                                    {nftList.price} ETH
                                                </span>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-0 w-full bg-green-400 dark:bg-green-600 hidden group-hover:block text-center font-extrabold">
                                            Go to Dao
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
                <div className="my-20 sm:hidden"></div>
                <section className="sm:p-4 p-2 rounded-md w-full container mx-auto my-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xl sm:text-3xl font-extrabold m-2">DefenDao List</p>
                        <div className="flex items-center justify-end">
                            <div className="flex bg-gray-50 dark:bg-gray-700 items-center p-2 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 
                    000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <input
                                    className="bg-gray-50 dark:bg-gray-700 outline-none ml-1"
                                    type="serach"
                                    id="serach"
                                    placeholder="search..."
                                    onChange={onChange}
                                    value={searchbar}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto h-max mb-40 hover:shadow-xl dark:hover:shadow-slate-700 dark:hover:shadow-lg bg-inherit shadow-md transition-all">
                        <div className="grid grid-cols-10 font-semibold text-center text-md sm:text-xl py-4 bg-slate-200 dark:bg-slate-800 p-2 rounded-t-xl text-slate-700 dark:text-slate-400">
                            <div className="col-span-1 hidden sm:block">Rank</div>
                            <div className="col-span-2 sm:col-span-1"></div>
                            <div className="col-span-3 ">CollectionName</div>
                            <div className="col-span-3 sm:col-span-1">Tickets</div>
                            <div className="col-span-2 hidden sm:block">TVL</div>
                            <div className="col-span-1 hidden sm:block">FloorPrice</div>
                            <div className="col-span-1 mx-4"></div>
                        </div>
                        {loading ? (
                            <>
                                <div className="relative flex justify-center items-center py-10 p-2 border-b px-auto border-b-slate-500 bg-slate-200 dark:bg-slate-900 bg-opacity-20 animate-pulse">
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
                            defendaoData.map((daoList, i) => (
                                <div
                                    className="relative grid grid-cols-10 py-5 p-2 border-b text-center text-md sm:text-xl border-b-slate-500 bg-slate-100 dark:bg-slate-900 bg-opacity-20 group"
                                    key={i}
                                >
                                    <div className="col-span-1 hidden sm:block"># {i + 1}</div>
                                    <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                                        {daoList.opensea.collection.image_url !==
                                        (
                                            <>
                                                <div className="bg-slate-400 animate-pulse"></div>
                                            </>
                                        ) ? (
                                            <>
                                                <Image
                                                    src={daoList.opensea.collection.image_url}
                                                    width={100}
                                                    height={100}
                                                    unoptimized="true"
                                                    alt="CollectionImg"
                                                    className=" rounded-xl"
                                                    aria-placeholder="CollectionImg"
                                                />
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="col-span-3 ">{daoList.opensea.collection.name}</div>
                                    <div className="col-span-3 sm:col-span-1">🏷 1412</div>
                                    <div className="col-span-2 hidden sm:block">142,123 USDT </div>
                                    <div className="col-span-1 hidden sm:block"> {daoList.floorPrice} ETH</div>
                                    <div className="col-span-1 mx-4 flex justify-center items-center">
                                        <Link
                                            id="link"
                                            href={{
                                                pathname: `/dao/${daoList.opensea.collection.name}`,
                                                query: {
                                                    id: daoList.id,
                                                    floorPrice: daoList.floorPrice,
                                                    address: daoList.address,
                                                    name: daoList.opensea.collection.name,
                                                    img: daoList.opensea.collection.image_url,
                                                    data: JSON.stringify(defendaoData[i]),
                                                },
                                            }}
                                            as={`/dao/${daoList.opensea.collection.name}`}
                                        >
                                            <div className="relative bg-green-400 dark:bg-green-600 p-4 font-extrabold shadow-xl rounded-lg hover:z-50 invisible group-hover:visible">
                                                Enter
                                            </div>
                                        </Link>
                                        {/* <div className="absolute left-0 top-0 w-full h-32 hover:bg-slate-700 hover:bg-opacity-20 z-0"></div> */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

// export async function getServerSideProps() {
//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//     },
//   };

//   const res = await fetch(
//     "https://api.opensea.io/api/v1/collections?offset=0&limit=50",
//     options
//   );
//   const result = await res.json();

// console.log(collections);

//   return {
//     props: { result },
//   };
// }
