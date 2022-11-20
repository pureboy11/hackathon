import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import Darkmode from "./Darkmode";

export default function Header() {
  const [ethers, setEthers] = useState("");
  const [account, setAccount] = useState("noaddress");
  const [walletType, setWalletType] = useState("");
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    console.log(window.ethereum);
    // if (typeof window.ethereum !== "undefined") {
    try {
      const web = new ethers(window.ethereum);
      setEthers(web);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    setWalletType("eth");
  };

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 140) {
        setAnimateHeader(true);
      } else setAnimateHeader(false);
    };
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <>
      <div
        className={`sticky top-0 z-20 flex py-3 shadow-md my-auto bg-white dark:bg-slate-900 header ${
          animateHeader && "header--animated hidden"
        }`}
      >
        <Link href="/" id="link" className="mx-5 my-auto text-gray-400">
          Home
        </Link>
        <Link href="/work" id="link" className="mr-5 my-auto text-gray-400">
          Work Place
        </Link>
        <div className="ml-auto mr-4 flex items-center">
          <button
            className="bg-orange-500 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-4"
            type="button"
            onClick={connectWallet}
          >
            {/*<i className="fas fa-arrow-alt-circle-down"></i>*/}
            Connect metamask
          </button>
          <Darkmode />
        </div>
      </div>
    </>
  );
}