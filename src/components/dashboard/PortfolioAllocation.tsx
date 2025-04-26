
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface PortfolioAllocationProps {
  data: DataItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PortfolioAllocation: React.FC<PortfolioAllocationProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioAllocation;
