import { GoalFamilySlug } from '@/lib/api/types/goals';
import {
  Droplet,
  Shield,
  TrendingUp,
  CreditCard,
  Heart,
  Star,
} from 'lucide-react';

type IconComponent = typeof TrendingUp;

export interface GoalFamilyConfig {
  slug: GoalFamilySlug;
  label: string;
  description: string;
  accentColor: string;
  icon: IconComponent;
}

export const GOAL_FAMILY_CONFIGS: Record<GoalFamilySlug, GoalFamilyConfig> = {
  'invest-grow': {
    slug: 'invest-grow',
    label: 'Invest & Grow',
    description: 'Wealth-building and investing targets',
    accentColor: 'text-emerald-600',
    icon: TrendingUp,
  },
  'debt-obligations': {
    slug: 'debt-obligations',
    label: 'Debt & Obligations',
    description: 'Debt payoff and required payments',
    accentColor: 'text-rose-600',
    icon: CreditCard,
  },
  'lifestyle-milestones': {
    slug: 'lifestyle-milestones',
    label: 'Lifestyle & Milestones',
    description: 'Major purchases & wellness',
    accentColor: 'text-pink-600',
    icon: Heart,
  },
  'risk-protection': {
    slug: 'risk-protection',
    label: 'Risk & Protection',
    description: 'Insurance & safety nets',
    accentColor: 'text-sky-600',
    icon: Shield,
  },
  'values-legacy': {
    slug: 'values-legacy',
    label: 'Values & Legacy',
    description: 'Giving & purpose-aligned goals',
    accentColor: 'text-purple-600',
    icon: Star,
  },
  'liquidity-resilience': {
    slug: 'liquidity-resilience',
    label: 'Liquidity & Resilience',
    description: 'Emergency funds & buffers',
    accentColor: 'text-cyan-600',
    icon: Droplet,
  },
};

export const getGoalFamilyConfig = (slug?: GoalFamilySlug | string | null) => {
  if (!slug) return undefined;
  // Handle both UUID (from primaryFamilyId) and slug
  if (slug in GOAL_FAMILY_CONFIGS) {
    return GOAL_FAMILY_CONFIGS[slug as GoalFamilySlug];
  }
  return undefined;
};

export const getGoalFamilyConfigBySlug = (slug?: string | null): GoalFamilyConfig | undefined => {
  if (!slug) return undefined;
  // Slug should match exactly (with hyphens)
  if (slug in GOAL_FAMILY_CONFIGS) {
    return GOAL_FAMILY_CONFIGS[slug as GoalFamilySlug];
  }
  return undefined;
};

