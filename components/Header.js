import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Darkmode from "./Darkmode";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  useEffect(() => {
    // console.log(window.ethereum);
    // // if (typeof window.ethereum !== "undefined") {
    // try {
    //   const web = new ethers(window.ethereum);
    //   setEthers(web);
    // } catch (err) {
    //   console.log(err);
    // }
  }, []);

  // useEffect(() => {
  //   const listener = () => {
  //     if (window.scrollY > 140) {
  //       setAnimateHeader(true);
  //     } else setAnimateHeader(false);
  //   };
  //   window.addEventListener("scroll", listener);

  //   return () => {
  //     window.removeEventListener("scroll", listener);
  //   };
  // }, []);

  useEffect(() => {
    ethers;
  }, []);

  return (
    <>
      <div
        className={`sticky top-0 z-20 flex py-3 shadow-md my-auto bg-white dark:bg-[#1B1E25] header"
        }`}
      >
        <a href="/" id="link" className="mx-5 my-auto text-gray-400">
          DefenDAO
        </a>
        <div className="ml-auto mr-4 flex items-center">
          <ConnectButton />
          <Darkmode />
        </div>
      </div>
    </>
  );
}
