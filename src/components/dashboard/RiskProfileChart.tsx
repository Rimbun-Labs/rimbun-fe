
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface DataItem {
  attribute: string;
  value: number;
}

interface RiskProfileChartProps {
  data: DataItem[];
}

const RiskProfileChart: React.FC<RiskProfileChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="attribute" />
          <Radar
            name="Risk Profile"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskProfileChart;
