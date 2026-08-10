export type AdminCategory = { id: string; name: string; slug: string };

export type VideoType = "long" | "short";

export type PortfolioItem = {
  id: string;
  category_id: string;
  title: string;
  subtitle: string | null;
  youtube_id: string;
  youtube_url: string | null;
  video_type: VideoType;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
};

export const ITEM_COLUMNS =
  "id,category_id,title,subtitle,youtube_id,youtube_url,video_type,sort_order,is_active,is_featured";
