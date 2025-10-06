import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

interface PortfolioChartProps {
  sessionId: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ sessionId }) => {
  // Sample data - in real app, this would come from your API
  const portfolioData = {
    labels: ['Equities', 'Bonds', 'Real Estate', 'Cash'],
    datasets: [{
      data: [20, 40, 15, 25],
      backgroundColor: [
        '#36A2EB', // Blue for Equities
        '#FF6384', // Red for Bonds
        '#FFCE56', // Yellow for Real Estate
        '#4BC0C0', // Teal for Cash
      ],
      borderWidth: 1,
    }],
  };

  return (
    <div className="h-[600px] flex flex-col">
      <h3 className="text-xl font-semibold mb-6 text-foreground">Your Recommended Portfolio</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Pie data={portfolioData} />
        </div>
      </div>
    </div>
  );
}; 