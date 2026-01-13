import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import type { BankingProduct } from '@/lib/api/types/banking';

interface ScoreExplanationDialogProps {
  product: BankingProduct;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ScoreExplanationDialog: React.FC<ScoreExplanationDialogProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  if (!product.scoreBreakdown || product.scoreBreakdown.length === 0) {
    return null;
  }

  const chartData = product.scoreBreakdown.map(item => ({
    name: item.category,
    value: item.score,
    color: item.color,
  }));

  const topContributor = product.scoreBreakdown.reduce((max, item) =>
    item.score > max.score ? item : max
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Score Explanation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Overall Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {Math.round(product.matchScore)}%
            </div>
            <p className="text-sm text-muted-foreground">Overall Match Score</p>
          </div>

          {/* Breakdown Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number) => [`${value}%`, 'Score']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold">Score Breakdown</h4>
            {product.scoreBreakdown.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </div>

          {/* Top Contributor */}
          {topContributor && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Top Contributor</p>
              <p className="text-sm text-muted-foreground">
                {topContributor.category} contributes {topContributor.score}% to your match score.
              </p>
            </div>
          )}

          {/* Explanation */}
          {product.explanation?.mainExplanation && (
            <div className="space-y-2">
              <h4 className="font-semibold">Why This Score?</h4>
              <p className="text-sm text-muted-foreground">
                {product.explanation.mainExplanation}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

