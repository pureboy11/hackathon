import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import TitleManager from "../components/TitleManager";

export default function Home(collections, props) {
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

  const [showDAO, setShowDao] = useState(false);
  const router = useRouter;

  return (
    <>
      <TitleManager pageTitle="home" />
      <section className="text-gray-600 body-font z-10 relative">
        <div className="INFO flex items-center justify-center mt-2 container mx-auto">
          <Image
            src="/Defendao_Logo.png"
            width={180}
            height={180}
            alt="Logo"
            objectFit="contain"
            className="m-10"
          />
          <div className="ml-5">
            <h1 className="title-font text-3xl mb-4 text-gray-900 font-extrabold">
              We are the DAO defending NFT prices.
            </h1>
            <p className="text-xl font-semibold mb-8 leading-relaxed">
              One of the DAO members will purchase the NFT that come as a quick
              sale with randomly.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto container p-8">
        <p className="text-3xl font-extrabold m-2">Latest Transfers</p>
        <div className="border-2 dark:border-slate-800 border-slate-100 rounded-lg p-6 overflow-x-auto w-full grid grid-flow-col gap-8 shadow-md dark:shadow-slate-600 shadow-slate-200 scroll-smooth">
          {latestBuying.map((nftList, id) => (
            <Link key={nftList.id} href={`/dao/${nftList.id}`}>
              <div
                className="NFTCARDS relative hover:shadow-xl dark:hover:shadow-slate-700 dark:hover:shadow-lg overflow-hidden bg-inherit rounded-xl shadow-md transition-all cursor-pointer group w-52"
                key={id}
              >
                <div className="flex flex-col asepct-square rounded-t-md overflow-hidden items-center">
                  <Image
                    src="https://global-uploads.webflow.com/6241bcd9e666c1514401461d/6300caa62713a31a40fbee12_uVorQzNs.jpg"
                    alt="NFT Img"
                    className="object-cover block hover:scale-105 hover:rounded-t-xl group-hover:rounded-t-xl group-hover:scale-105 transition-all duration-300"
                    width={250}
                    height={250}
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
                      {nftList}
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
          ))}
        </div>
      </section>

      <div className="p-8 rounded-md w-full container mx-auto mt-4">
        <div className="flex items-center justify-between pb-6">
          <div>
            <p className="text-3xl font-extrabold m-2">NFT DefenDao List</p>
            <span className="text-lg font-semibold m-2">All products item</span>
          </div>
          <div className="flex items-center justify-between w-max">
            <div className="flex bg-gray-50 dark:bg-gray-700 items-center p-2 rounded-md w-96">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="bg-gray-50 dark:bg-gray-700 outline-none ml-1 block"
                type="text"
                name=""
                id=""
                placeholder="search..."
              />
            </div>
          </div>
        </div>
        <div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Created at
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider"></th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                      Join Btn
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Vera Carpenter
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Admin</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Jan 21, 2020
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200  text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">43</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Activo</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold">
                        # 1
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <Link href="/dao/123">
                        <button className="bg-slate-500 rounded-xl p-2 w-24">
                          <p>Enter</p>
                        </button>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Blake Bowman
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm" />
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">77</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Activo</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Dana Moore
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm" />
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">64</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Suspended</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img
                            className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Alonzo Cox
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Admin</p>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Jan 18, 2020
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">70</p>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Inactive</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="px-5 py-5 border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  &nbsp; &nbsp;
                  <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 빌드 타임에 호출
// export async function getServerSideProps() {
//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//     },
//   };

//   const res = await fetch(
//     "https://api.opensea.io/api/v1/collections?offset=0&limit=100",
//     options
//   );
//   const collections = await res.json();
//   const collectionList = collections.collections;
//   // console.log(collections);

//   return {
//     props: { collectionList },
//   };
// }
