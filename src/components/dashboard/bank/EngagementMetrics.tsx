import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFormatters } from '@/hooks/useFormatters';
import { MessageCircle, Clock, Users } from 'lucide-react';
import type { EngagementMetrics } from '@/lib/api/types/bankInsights';

interface EngagementMetricsProps {
  data: EngagementMetrics;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ data }) => {
  const { formatNumber } = useFormatters();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>
          User activity and platform usage statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Users */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Active Users</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{formatNumber(data.activeUsers.last30Days)}</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(data.activeUsers.last90Days)}</p>
              <p className="text-xs text-muted-foreground">Last 90 days</p>
            </div>
          </div>
        </div>

        {/* Assessment Completion */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Assessment Completion</span>
            <span className="text-lg font-bold">
              {data.assessmentCompletion.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatNumber(data.assessmentCompletion.completed)} of {formatNumber(data.assessmentCompletion.total)} completed
          </div>
        </div>

        {/* Chat Engagement */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Chat Engagement</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Users who chatted</span>
              <span className="text-sm font-semibold">
                {formatNumber(data.chatEngagement.usersWhoChatted)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg messages per user</span>
              <span className="text-sm font-semibold">
                {data.chatEngagement.averageMessagesPerUser.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total chat sessions</span>
              <span className="text-sm font-semibold">
                {formatNumber(data.chatEngagement.totalChatSessions)}
              </span>
            </div>
          </div>
        </div>

        {/* Session Activity */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Session Activity</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg sessions per user</span>
              <span className="text-sm font-semibold">
                {data.sessionActivity.averageSessionsPerUser.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg session duration</span>
              <span className="text-sm font-semibold">
                {data.sessionActivity.averageSessionDuration.toFixed(1)} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total sessions</span>
              <span className="text-sm font-semibold">
                {formatNumber(data.sessionActivity.totalSessions)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

