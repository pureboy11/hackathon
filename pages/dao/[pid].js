import { useRouter } from "next/router";
import TitleManager from "../../components/TitleManager";
import { useRef, useEffect } from "react";
import Chart from "../../components/common/chart";

export default function DefenDaoDetail(props) {
  const router = useRouter;
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
      <div className="dark:text-slate-300 ml-5 mt-5 pb-2">{` TAG > TAG > TAG `}</div>
      <div className="relative mx-3 lg:mx-20 h-screen">
        <section className="INFO h-36 mb-10">
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
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
            Summary
          </button>
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
            My Bids
          </button>
          <button className="p-4 mr-4 mt-10 mb-4 bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-2xl text-lg shadow-md">
            Recent Liq
          </button>
        </section>
        <section className="lg:grid lg:grid-cols-6">
          <div className="col-span-4 m-4 h-[300px] lg:h-[600px]">
            <Chart className="" />
          </div>
          <div className="col-span-2 border border-slate-200 m-4 lg:h-[600px]">
            ContracT 제출
            <div>sadfsdaf</div>
          </div>
        </section>
      </div>
    </>
  );
}
