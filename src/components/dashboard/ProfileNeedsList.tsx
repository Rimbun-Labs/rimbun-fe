import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, X, AlertCircle, AlertTriangle, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileNeeds } from '@/hooks/useProfileNeeds';
import type { GapItemDto, GapSeverity } from '@/lib/api/types/needsAndGaps';

const severityOrder: Record<GapSeverity, number> = { high: 0, medium: 1, low: 2 };

function severityIcon(severity: GapSeverity) {
  switch (severity) {
    case 'high':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
}

function severityBorderClass(severity: GapSeverity): string {
  switch (severity) {
    case 'high':
      return 'border-l-destructive';
    case 'medium':
      return 'border-l-amber-500';
    default:
      return 'border-l-muted-foreground/40';
  }
}

/** Resolves linkTarget to a path: if it starts with / use as-is, else treat as goal id -> /goals/:id */
function toPath(linkTarget: string | null | undefined): string | null {
  if (!linkTarget?.trim()) return null;
  const t = linkTarget.trim();
  return t.startsWith('/') ? t : `/goals/${t}`;
}

interface ProfileNeedsListProps {
  onDismiss?: () => void;
}

/** Get short CTA label from actionableCopy or default */
function getActionLabel(gap: GapItemDto): string {
  const copy = gap.actionableCopy?.trim();
  if (copy && copy.length <= 24) return copy;
  if (copy) return copy.split(/[.,]/)[0]?.trim() || 'Do it';
  return 'Do it';
}

export const ProfileNeedsList: React.FC<ProfileNeedsListProps> = ({ onDismiss }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, error } = useProfileNeeds();
  const gaps = data?.gaps ?? [];

  const [hero, ...rest] = useMemo(() => {
    const sorted = [...gaps].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return sorted;
  }, [gaps]);

  const handleClick = (gap: GapItemDto) => {
    const path = toPath(gap.linkTarget);
    if (path) navigate(path);
  };

  const restToShow = expanded ? rest : rest.slice(0, 2);
  const hasMore = rest.length > 2;
  const moreCount = rest.length - 2;

  if (isLoading) {
    return (
      <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-6 w-32 rounded bg-primary/10 animate-pulse" />
              <div className="h-4 w-64 rounded bg-primary/5 animate-pulse mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-primary/5 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                Things to do
              </CardTitle>
              <CardDescription>
                Prioritized actions to improve your financial plan
              </CardDescription>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load your action items. You can try refreshing the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              Things to do
            </CardTitle>
            <CardDescription>
              {gaps.length > 0
                ? "Start with the first one — we'll suggest more after."
                : 'Prioritized actions to improve your financial plan'}
            </CardDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {gaps.length > 0 ? (
          <div className="space-y-4">
            {/* Hero: Do this next */}
            {hero && (
              <div
                className={cn(
                  'rounded-xl border-l-4 p-4 text-left transition-colors',
                  severityBorderClass(hero.severity),
                  'bg-primary/10 border-primary/20'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">
                    Do this next
                  </span>
                </div>
                <p className="font-semibold text-foreground mb-1">{hero.message}</p>
                {hero.actionableCopy && (
                  <p className="text-sm text-muted-foreground mb-4">{hero.actionableCopy}</p>
                )}
                {toPath(hero.linkTarget) && (
                  <Button
                    size="sm"
                    onClick={() => handleClick(hero)}
                    className="mt-1"
                  >
                    {getActionLabel(hero)}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            )}

            {/* More for you */}
            {rest.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-1 mb-2">
                  More for you
                </p>
                {restToShow.map((gap, index) => {
                  const path = toPath(gap.linkTarget);
                  const isClickable = !!path;
                  return (
                    <div
                      key={`${gap.type}-${index}`}
                      className={cn(
                        'flex items-center gap-3 py-2.5 px-3 rounded-lg border-l-4 text-left transition-colors',
                        severityBorderClass(gap.severity),
                        isClickable && 'cursor-pointer hover:bg-accent/50',
                        !isClickable && 'opacity-90'
                      )}
                      onClick={() => isClickable && handleClick(gap)}
                      onKeyDown={(e) => {
                        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleClick(gap);
                        }
                      }}
                      role={isClickable ? 'button' : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                    >
                      <div className="flex-shrink-0">
                        {severityIcon(gap.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{gap.message}</div>
                        {gap.actionableCopy && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {gap.actionableCopy}
                          </div>
                        )}
                      </div>
                      {isClickable && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
                {hasMore && !expanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-muted-foreground mt-1"
                    onClick={() => setExpanded(true)}
                  >
                    See {moreCount} more
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                )}
                {hasMore && expanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-muted-foreground mt-1"
                    onClick={() => setExpanded(false)}
                  >
                    Show less
                    <ChevronDown className="h-4 w-4 ml-1 rotate-180" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/10 bg-primary/5">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-foreground">You&apos;re on track</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No actions needed right now. We&apos;ll suggest next steps when something needs your attention.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileNeedsList;
