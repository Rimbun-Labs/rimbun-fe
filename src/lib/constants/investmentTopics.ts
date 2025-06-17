import { 
  TrendingUp, 
  BarChart2, 
  DollarSign, 
  Globe, 
  Shield, 
  Building2,
  LineChart,
  PieChart,
  AlertCircle,
  Search,
  LucideIcon
} from 'lucide-react';

export interface Topic {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  prompts: string[];
}

export const topics: Topic[] = [
  {
    id: 'stock-analysis',
    name: 'Stock Analysis',
    icon: TrendingUp,
    description: 'Analyze individual stocks, compare metrics, and find opportunities',
    prompts: [
      'Help me find undervalued stocks',
      'Show me stocks with strong fundamentals',
      'Find me growth stocks with good risk/reward',
      'Compare stocks in the tech sector',
      'Analyze a stock I\'m interested in',
      'What is PE Ratio?',
      'What is Dividend Yield?',
      'What is Free Cash Flow?'
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research',
    icon: BarChart2,
    description: 'Research market trends, sectors, and overall market conditions',
    prompts: [
      'What are the top performing sectors?',
      'Show me market trends for tech stocks',
      'Analyze current market conditions',
      'What sectors are expected to grow?',
      'Show me market volatility indicators'
    ]
  },
  {
    id: 'income-investing',
    name: 'Income Investing',
    icon: DollarSign,
    description: 'Find dividend stocks, bonds, and other income-generating investments',
    prompts: [
      'Find me bonds with yield above 4%',
      'Show me high-dividend stocks',
      'Find me income-generating ETFs',
      'Compare dividend growth rates',
      'Find me stable income investments'
    ]
  },
  {
    id: 'global-markets',
    name: 'Global Markets',
    icon: Globe,
    description: 'Explore international markets and global investment opportunities',
    prompts: [
      'Find me emerging market opportunities',
      'Show me international ETFs',
      'Analyze global market trends',
      'Compare international markets',
      'Find me global growth opportunities'
    ]
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    icon: Shield,
    description: 'Learn about risk management strategies and portfolio protection',
    prompts: [
      'How can I hedge my portfolio?',
      'Show me low-risk investment options',
      'Analyze my portfolio risk',
      'Find me defensive stocks',
      'How can I protect against market volatility?'
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Building2,
    description: 'Explore REITs and real estate investment opportunities',
    prompts: [
      'Find me high-yield REITs',
      'Show me real estate ETFs',
      'Analyze real estate market trends',
      'Compare different REIT sectors',
      'Find me real estate growth opportunities'
    ]
  },
  {
    id: 'technical-analysis',
    name: 'Technical Analysis',
    icon: LineChart,
    description: 'Learn about technical indicators and chart patterns',
    prompts: [
      'Show me stocks with bullish patterns',
      'Find me stocks with strong momentum',
      'Analyze support and resistance levels',
      'Show me volume analysis',
      'Find me stocks with breakout potential'
    ]
  },
  {
    id: 'portfolio-optimization',
    name: 'Portfolio Optimization',
    icon: PieChart,
    description: 'Optimize your portfolio allocation and diversification',
    prompts: [
      'How should I allocate my portfolio?',
      'Show me diversification strategies',
      'Analyze my current allocation',
      'Find me portfolio rebalancing opportunities',
      'How can I optimize my returns?'
    ]
  }
]; 