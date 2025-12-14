import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts({ stats }) {
  const labels = Object.keys(stats.averages || {});
  const data = {
    labels,
    datasets: [
      { label: "Average", data: labels.map((l) => stats.averages[l] || 0) },
    ],
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-medium mb-2">Subject Averages</h3>
      <Bar data={data} />
    </div>
  );
}
