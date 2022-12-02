import { NumericFormat } from "react-number-format";

export default function ClaimModal(props) {
  return (
    <section>
      <div
        className="fixed inset-0 bg-black opacity-80 duration-300 z-30"
        onClick={() => props.setClaimModal(false)}
      ></div>

      <div className="absolute bottom-1/2 right-8 bg-slate-800 rounded-lg h-60 w-96 shadow-xl p-4 z-50">
        claim request
        <div className="relative"></div>
        <button
          className="absolute right-3 top-3 hover:-rotate-90 duration-300"
          onClick={() => props.setClaimModal(false)}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mt-5 gap-4">
          {/* <div className="mt-4 bg-slate-700 p-4 w-40 rounded-xl mx-auto">
            <NumericFormat
              className="text-white text-right"
              value={props.inputTargetPrice}
              decimalScale={3}
              thousandSeparator=","
              displayType="text"
              suffix="ETH"
            />
          </div> */}
          <div className="mt-4 bg-slate-700 p-4 w-40 rounded-xl mx-auto">
            <NumericFormat
              className="text-white text-right"
              value={props.claimableNFTs.length}
              decimalScale={0}
              thousandSeparator=","
              displayType="text"
              suffix="NFTs"
            />{" "}
          </div>
        </div>
        <div className="flex justify-end mt-5 gap-4">
          <button
            className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl"
            onClick={() => props.setClaimModal(false)}
          >
            cancel
          </button>
          <button
            className="dark:bg-slate-700 bg-slate-300 px-6 py-4 rounded-2xl"
            onClick={() => props.sendtoBlock()}
          >
            Claim NFT
          </button>
        </div>
      </div>
    </section>
  );
}
