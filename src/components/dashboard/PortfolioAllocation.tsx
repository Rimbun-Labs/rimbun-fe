
import { ResponsivePie } from '@nivo/pie';

interface DataItem {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface PortfolioAllocationProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const PortfolioAllocation: React.FC<PortfolioAllocationProps> = ({ data }) => {
  // Transform data for Nivo Pie chart
  const chartData: DataItem[] = data.map(item => ({
    id: item.name,
    label: item.name,
    value: item.value,
  }));

  return (
    <div className="h-[300px]">
      <ResponsivePie
        data={chartData}
        margin={{ top: 30, right: 80, bottom: 30, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        colors={{ scheme: 'blues' }}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 72,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  );
};

export default PortfolioAllocation;
