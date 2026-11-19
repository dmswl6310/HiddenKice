import { LevelChartIcon, TargetIcon, TrophyIcon } from "@/shared/components/icons";
import type { BannerFeatureIcon as IconName } from "../model/types";

const iconMap = {
  target: TargetIcon,
  levelChart: LevelChartIcon,
  trophy: TrophyIcon,
} as const satisfies Record<IconName, unknown>;

export function BannerFeatureIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
