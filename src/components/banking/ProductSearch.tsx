import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onPresetSelect: (preset: string) => void;
  searchMode?: 'product' | 'institution';
  onModeChange?: (mode: 'product' | 'institution') => void;
}

const PRESET_PRODUCTS = [
  'Savings Account',
  'Credit Card',
  'Fixed Deposit',
  'Personal Loan',
  'Investment Account',
  'Mortgage'
];

const PRESET_INSTITUTIONS = [
  'Maybank',
  'CIMB',
  'Public Bank',
  'RHB',
  'Hong Leong',
  'AmBank'
];

export const ProductSearch = ({ 
  onSearch, 
  onPresetSelect,
  searchMode = 'product',
  onModeChange 
}: ProductSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    onPresetSelect(preset);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Welcome Query */}
          <h2 className="text-2xl font-semibold text-foreground">
            What are you looking for today?
          </h2>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch(query);
                }
              }}
              placeholder="Search by product or institution..."
              className="pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Mode Toggle */}
          {onModeChange && (
            <div className="flex gap-2">
              <Button
                variant={searchMode === 'product' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('product')}
              >
                By Product
              </Button>
              <Button
                variant={searchMode === 'institution' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('institution')}
              >
                By Institution
              </Button>
            </div>
          )}

          {/* Preset Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Popular {searchMode === 'product' ? 'Products' : 'Institutions'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(searchMode === 'product' ? PRESET_PRODUCTS : PRESET_INSTITUTIONS).map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="rounded-full"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



