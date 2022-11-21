import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = [
  "0.52ETH",
  "0.48ETH",
  "0.44ETH",
  "0.4ETH",
  "0.35ETH",
  "0.3ETH",
  "0.24ETH",
  "0.18ETH",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Current number of tickets",
      data: [0.3, 0.4, 0.7, 0.1, 0.3, 0.5, 0.7, 0.9],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "completed contracts",
      data: [0.3, 0.4, 0.7, 0.1, 0.3, 0.5, 0.7, 0.9],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export default function Chart() {
  return (
    <>
      <Bar
        data={data}
        width={200}
        height={400}
        options={{ maintainAspectRatio: false }}
      />
    </>
  );
}
