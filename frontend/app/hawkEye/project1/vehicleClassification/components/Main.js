"use client"; // Use this if you're using Next.js with React

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const VehicleAreaChart = () => {
  const vehicleData = [
    { date: "2024-04-05", vehicle: "Van", count: 10 },
    { date: "2024-04-05", vehicle: "Jeep", count: 5 },
    { date: "2024-04-06", vehicle: "Van", count: 12 },
    { date: "2024-04-06", vehicle: "Jeep", count: 8 },
    { date: "2024-04-07", vehicle: "Van", count: 15 },
    { date: "2024-04-07", vehicle: "Jeep", count: 20 },
    { date: "2024-04-08", vehicle: "Van", count: 18 },
    { date: "2024-04-08", vehicle: "Jeep", count: 25 },
    { date: "2024-04-09", vehicle: "Van", count: 22 },
    { date: "2024-04-09", vehicle: "Jeep", count: 30 },
  ];

  // Get unique dates
  const dates = [...new Set(vehicleData.map(data => data?.date))];

  // Prepare datasets for each vehicle type
  const datasets = [
    {
      label: "Van",
      data: dates.map(date => {
        const entry = vehicleData.find(d => d?.date === date && d?.vehicle === "Van");
        return entry ? entry.count : 0;
      }),
      fill: true, // Fill the area under the line
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 2,
      tension: 0.4, // Curved line
      pointRadius: 5,
    },
    {
      label: "Jeep",
      data: dates.map(date => {
        const entry = vehicleData.find(d => d?.date === date && d?.vehicle === "Jeep");
        return entry ? entry.count : 0;
      }),
      fill: true, // Fill the area under the line
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      tension: 0.4, // Curved line
      pointRadius: 5,
    },
  ];

  // Data object for the chart
  const data = {
    labels: dates,
    datasets: datasets,
  };

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Dates",
        },
      },
      y: {
        title: {
          display: false,
          text: "Number of Vehicles",
        },
        beginAtZero: true,
      },
    },
  };

  return (
      <Line data={data} options={options} />
 
  );
};

export default VehicleAreaChart;
