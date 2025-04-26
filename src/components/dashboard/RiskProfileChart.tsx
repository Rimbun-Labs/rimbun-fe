
import { ResponsiveRadar } from '@nivo/radar';

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
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="attribute"
        maxValue={10}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={15}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'blues' }}
        blendMode="multiply"
        motionConfig="gentle"
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -40,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
};

export default RiskProfileChart;
