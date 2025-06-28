import { useMemo } from 'react';

export const useFormatters = () => {
  const currencyFormatter = useMemo(() => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }), []
  );
  
  const percentageFormatter = useMemo(() => 
    new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }), []
  );
  
  const numberFormatter = useMemo(() => 
    new Intl.NumberFormat('en-US'), []
  );

  const formatCurrency = useMemo(() => (value: number) => currencyFormatter.format(value), [currencyFormatter]);
  const formatPercentage = useMemo(() => (value: number) => percentageFormatter.format(value / 100), [percentageFormatter]);
  const formatNumber = useMemo(() => (value: number) => numberFormatter.format(value), [numberFormatter]);
  
  return { 
    currencyFormatter, 
    percentageFormatter, 
    numberFormatter,
    formatCurrency,
    formatPercentage,
    formatNumber
  };
}; 