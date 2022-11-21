import { useRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";

export default function DefenDaoDetail(props) {
  const router = useRouter;
  console.log(router);
  console.log(props);

  const chartRef = useRef(null);

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
      <div className="relative h-full mx-10">
        <div className="dark:text-slate-300 mt-5 pb-2">{` TAG > TAG > TAG `}</div>
        <section className="INFO h-36 border border-slate-100">
          <div className="grid grid-cols-6">
            <div className="col-span-4">
              <div className="flex items-center justify-start m-2">
                <div className="bg-yellow-200 rounded-full w-16 h-16 mr-4"></div>
                <div className="text-4xl font-semibold dark:text-slate-50">
                  Collection NAME
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-400 ml-20">
                Floor Price : 0.542 ETH
              </div>
            </div>
            <div className="">
              <div>Members 숫자</div>
              <div>Ticket 숫자</div>
            </div>
          </div>
        </section>
        <section className="gap-5">
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md hover:shadow-xl">
            Summary
          </button>
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md hover:shadow-xl">
            My Bids
          </button>
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md hover:shadow-xl">
            Recent Liquidations
          </button>
        </section>
        <section className="grid grid-cols-6 border border-slate-100">
          <div className="col-span-4 border border-yellow-100 m-4">
            <Chart className="" />
          </div>
          <div className="col-span-2 border border-yellow-100 m-4">
            ContracT 제출
          </div>
        </section>
      </div>
    </>
  );
}
