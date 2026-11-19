export type BannerFeatureIcon = "target" | "levelChart" | "trophy";

export type BannerFeature = {
  icon: BannerFeatureIcon;
  title: string;
  description: string;
};

export type BannerSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  features: BannerFeature[];
  cta: { label: string; href: string };
  image: { src: string; alt: string; width: number; height: number };
};
