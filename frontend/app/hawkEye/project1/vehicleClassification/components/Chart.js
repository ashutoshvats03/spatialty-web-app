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
} from "chart.js";

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const VehicleLineChart = () => {
  const vehicleData = [
    { date: "2024-04-05", vehicle: "Van", count: 10 },
    { date: "2024-04-05", vehicle: "Jeep", count: 5 },
    { date: "2024-04-06", vehicle: "Auto Car", count: 8 },
    { date: "2024-04-06", vehicle: "Van", count: 12 },
    { date: "2024-04-07", vehicle: "Jeep", count: 15 },
    { date: "2024-04-08", vehicle: "Auto Car", count: 20 },
    { date: "2024-04-09", vehicle: "Van", count: 25 },
  ];

  // Get unique dates and vehicle types
  const dates = [...new Set(vehicleData.map(data => data?.date))];
  const vehicles = [...new Set(vehicleData.map(data => data?.vehicle))];

  // Prepare datasets for each vehicle type
  const datasets = vehicles.map(vehicle => {
    return {
      label: vehicle,
      data: dates.map(date => {
        const entry = vehicleData.find(d => d?.date === date && d?.vehicle === vehicle);
        return entry ? entry.count : 0; // Use 0 if no entry exists for that date
      }),
      fill: false,
      borderColor: "rgb(75, 192, 192)", // Function to get random color for each line
      borderWidth: 2,
      tension: 0.1,
      tension: 0.4,
    };
  });

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

  // Function to get a random color
 

  return (
      <Line data={data} options={options} />
  );
};

export default VehicleLineChart;
