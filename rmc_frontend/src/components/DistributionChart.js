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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
);

const DistributionChart = ({ distribution }) => {
  const data = {
    labels: ["Fantastic 5", "Great 4", "Good 3", "OK 2", "Terrible 1"],
    datasets: [
      {
        label: "Number of Reviews",
        data: distribution.ratings,
        backgroundColor: "#12406b",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // No grid lines
        },
        title: {
          display: false, // No label for the x-axis
        },
        ticks: {
          display: false
        },
      },
      y: {
        grid: {
          display: false, // No grid lines
        },
        title: {
          display: false, // No label for the y-axis
        },
      },
    },
    plugins: {
      legend: {
        display: false, // No legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      title: {
        display: false, // No title for the chart
      },
      datalabels: {
        color: '#ffffff',
        anchor: 'end', 
        align: 'start', 
        formatter: (value) => value ? value : '',
        font: {
          weight: 'bold',
        },
        padding: {
          right: 15
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DistributionChart;