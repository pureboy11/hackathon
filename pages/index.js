import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TitleManager from "../components/TitleManager";
import axios from "axios";
import { ethers } from "ethers";
import NFTCollection from "../components/data/NFTpuller.json";
import DefenDAOFactory from "../components/data/TestDefenDAOFactory.json";
import {
  nftContract,
  key,
  displayAmount,
  mainnet,
} from "../components/setting";

let pageSize = 50;
let startIdx = 0;
export default function Home(result, props) {
  const router = useRouter;
  const [latestBuying, setLatestBuying] = useState([
    "NFT NAME",
    "asdfasdf",
    "asdfasdf",
    "asdfasdf",
    "asdfasdf",
    "asdfasdf",
    "asdfasdf",
    "asdfasdf",
  ]);
  const [osCollection, setOsCollection] = useState([]);
  const [collectionImg, setCollectionImg] = useState([]);
  const [searchDAO, setSearchDAO] = useState("");
  const [collectionFetching, setCollectionFetching] = useState(false);
  const [selectedDao, setSelectedDao] = useState("");
  const [loading, setLoading] = useState(true);
  const [nftpuller, setNftpuller] = useState([]);

  const handleImgError = (e) => {
    // e.value.src = "/img/Defendao_Logo_m.png";
  };

  //OpenSea API//
  async function getOsCollection() {
    setLoading(true);

    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:8545/"
    );
    const contract = new ethers.Contract(
      "0x2538a10b7fFb1B78c890c870FC152b10be121f04",
      DefenDAOFactory,
      provider
    );
    const collist = await contract.getAllCollections();
    const slugs = await contract.getAllSlugs();

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    await slugs.map((slug) => {
      axios
        .get("https://api.opensea.io/api/v1/collection/" + slug, options)
        .then(function (response) {
          const res = response.data;
          console.log(res);
          let coll = osCollection;
          coll.push(res);
          setOsCollection(coll);
          //console.log(res);
          //const result = res.collection.slug;
          //console.log(result);
        });
    });

    setLoading(false);
  }

  //nftPuller//
  async function generateNft() {
    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:8545/"
    );
    const contract = new ethers.Contract(
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      DefenDAOFactory,
      provider
    );
    const itemArray = [];
    // contract.totalSupply().then((result) => {
    //   let totalSup = parseInt(result, 16);
    //   setLoading(true);

    //   for (let i = 0; i < displayAmount; i++) {
    //     var token = i + 1;
    //     const owner = contract.ownerOf(token);
    //     const rawUri = contract.tokenURI(token);
    //     const Uri = Promise.resolve(rawUri);
    //     console.log(Uri);
    //     const getUri = Uri.then((value) => {
    //       let str = value;
    //       let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
    //       let metadata = axios.get(cleanUri).catch(function (error) {
    //         console.log(error.toJSON());
    //       });
    //       return metadata;
    //     });
    //     getUri.then((value) => {
    //       let rawImg = value.data.image;
    //       console.log(value)
    //       var name = value.data.name;
    //       let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
    //       Promise.resolve(owner).then((value) => {
    //         let ownerW = value;
    //         let meta = {
    //           name: name,
    //           img: image,
    //           tokenId: token,
    //           wallet: ownerW,
    //         };
    //         console.log(meta);
    //         itemArray.push(meta);
    //       });
    //     });
    //   }
    // });
    await new Promise((r) => setTimeout(r, 5000));
    setNftpuller(itemArray);
    setLoading(false);
  }

  const collectionImgHandler = () => {};

  const onChange = (event) => {
    setSearchDAO(event.target.value);
  };

  useEffect(() => {
    getOsCollection();
  }, []);

  useEffect(() => {
    generateNft();
  }, [setNftpuller]);

  // console.log(osCollection);
  // console.log(collectionImg);
  // console.log(selectedDao);

  return (
    <>
      <TitleManager pageTitle="home" />
      <div className="mx-3 h-screen">
        <section className="text-gray-600 body-font z-10 relative">
          <div className="INFO lg:flex items-center justify-center mt-2 container mx-auto">
            <Image
              src="/Defendao_Logo.png"
              width={180}
              height={180}
              alt="Logo"
              className="m-10 mx-auto md:mx-5 w-auto h-auto"
              priority="true"
            />
            <div className="ml-5">
              <h1 className="title-font text-3xl mb-4 text-gray-900 font-extrabold">
                We are the DAO defending NFT prices.
              </h1>
              <p className="text-xl font-semibold mb-8 leading-relaxed">
                One of the DAO members will purchase the NFT that come as a
                quick sale with randomly.
              </p>
            </div>
          </div>
        </section>
        <section className="mx-auto container p-8">
          <p className="text-xl sm:text-3xl font-extrabold m-2">
            Latest Transfers
          </p>
          <div className="border-2 dark:border-slate-800 border-slate-100 rounded-lg p-6 overflow-x-auto w-full grid grid-flow-col gap-8 shadow-md dark:shadow-slate-600 shadow-slate-200 scroll-smooth">
            {loading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              nftpuller.map((nftList, id) => (
                <Link key={nftList.id} href={`/dao/${nftList.id}`}>
                  <div
                    className="NFTCARDS relative hover:shadow-xl dark:hover:shadow-slate-700 dark:hover:shadow-lg overflow-hidden bg-inherit rounded-xl shadow-md transition-all cursor-pointer group w-52"
                    key={id}
                  >
                    <div className="flex flex-col asepct-square overflow-hidden items-center">
                      <Image
                        src={nftList.img}
                        alt="NFT Img"
                        className="object-cover block hover:scale-125 rounded-t-xl hover:rounded-t-xl group-hover:scale-125 transition-all duration-300"
                        width={250}
                        height={250}
                        priority="true"
                      />
                    </div>
                    <div className="ICON -mt-3 flex justify-end bg-slate-100 dark:bg-slate-700">
                      <span className="bg-slate-400 dark:bg-slate-600 rounded-2xl px-2 z-10 mr-3 shadow-xl border border-slate-100">
                        Icons
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
                          0.124124 ETH
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

        <section className="p-8 rounded-md w-full container mx-auto mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-3xl font-extrabold m-2">
                DefenDao List
              </p>
            </div>
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
                  value={searchDAO}
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <>
            <div className="container mx-auto px-8 -mt-3">
              <div className="grid grid-cols-10 font-semibold text-center bg-slate-200 dark:bg-slate-700 p-2 rounded-t-xl">
                <div className="col-span-1 sm:col-span-1">Rank</div>
                <div className="col-span-1 hidden sm:block">Mainnet</div>
                <div className="col-span-3 sm:col-span-1">Img</div>
                <div className="col-span-2 hidden sm:block">CollectionName</div>
                <div className="col-span-3 sm:col-span-1">Members</div>
                <div className="col-span-3 sm:col-span-1">Tickets</div>
                <div className="col-span-1 hidden sm:block">TVL</div>
                <div className="col-span-1 hidden sm:block">FloorPrice</div>
              </div>
              {loading ? (
                <div className="relative grid grid-cols-10 py-10 p-2 border-b text-center px-auto border-b-slate-500 bg-slate-200 dark:bg-slate-900 bg-opacity-20 h-96 animate-pulse ">
                  <span>Loading...</span>
                </div>
              ) : (
                osCollection.map((daoList, id) => (
                  <div
                    className="relative grid grid-cols-10 py-10 p-2 border-b text-center border-b-slate-500 bg-slate-100 dark:bg-slate-900 bg-opacity-20 group"
                    key={daoList.id}
                  >
                    <div className="col-span-1 sm:col-span-1"># {id + 1}</div>
                    <div className="col-span-1 hidden sm:block">Etherium</div>
                    <div className="col-span-3 sm:col-span-1 flex justify-center items-center">
                      <>
                        {daoList.image_url ? (
                          <Image
                            src={daoList.image_url}
                            width={60}
                            height={60}
                            unoptimized="true"
                            alt="CollectionImg"
                            onError={handleImgError}
                            className="w-auto h-auto"
                            aria-placeholder="CollectionImg"
                          />
                        ) : null}
                      </>
                    </div>
                    <div className="col-span-2 hidden sm:block">
                      {daoList.name}
                    </div>
                    <div className="col-span-3 sm:col-span-1">👩‍👧‍👧 192 </div>
                    <div className="col-span-3 sm:col-span-1">🏷 1412</div>
                    <div className="col-span-1 hidden sm:block">
                      142,123 USDT{" "}
                    </div>
                    <div className="col-span-1 hidden sm:block"> 1.232 ETH</div>
                    <div className="col-span-1 invisible group-hover:visible mx-4">
                      <Link
                        href={{
                          pathname: `/dao/${daoList.name.replace(/ /g, "")}`,
                        }}
                        onClick={() => setSelectedDao(daoList)}
                      >
                        <div className="bg-orange-400 p-2 px-2 shadow-xl rounded-lg">
                          Enter
                        </div>
                      </Link>
                      {/* <div className="absolute left-0 top-0 w-full h-28 hover:bg-slate-800 hover:bg-opacity-20"></div> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
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
