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
      {
        label: "Average Score",
        data: labels.map((l) => stats.averages[l] || 0),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📈</span> Subject Performance Overview
      </h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
