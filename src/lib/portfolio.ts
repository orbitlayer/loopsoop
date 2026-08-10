import "server-only";
import { createPublicClient, hasSupabaseEnv } from "@/lib/supabase/public";
import { projects as staticProjects, type Project } from "@/lib/data";

/*
 * Data-access layer for the PUBLIC site. Reads published portfolio items from
 * Supabase and maps them to the existing `Project` shape so WorkGrid and
 * ProjectCard render exactly as before. Falls back to the static seed data only
 * when Supabase isn't configured (e.g. local dev without env).
 */

type PortfolioRow = {
  id: string;
  title: string;
  subtitle: string | null;
  youtube_id: string;
  video_type: "long" | "short";
  is_featured: boolean;
  sort_order: number;
  categories: { name: string; slug: string } | null;
};

const SELECT =
  "id,title,subtitle,youtube_id,video_type,is_featured,sort_order,categories(name,slug)";

function rowToProject(r: PortfolioRow): Project {
  const categoryName = r.categories?.name ?? "";
  return {
    id: r.id,
    title: r.title,
    category: r.subtitle?.trim() || categoryName, // small label under the title
    filter: categoryName, // matches the Our Work / portfolio filter chips
    type: r.video_type,
    seed: 0, // real YouTube thumbnail is always present, so seed is unused
    youtubeId: r.youtube_id,
    featured: r.is_featured,
  };
}

export type PortfolioResult = { projects: Project[]; error: boolean };

/** All published portfolio items, ordered by sort_order. */
export async function getPortfolioProjects(): Promise<PortfolioResult> {
  if (!hasSupabaseEnv()) return { projects: staticProjects, error: false };

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select(SELECT)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return {
      projects: (data as unknown as PortfolioRow[]).map(rowToProject),
      error: false,
    };
  } catch (e) {
    console.error("[portfolio] Supabase fetch failed:", e);
    return { projects: [], error: true };
  }
}

/**
 * Featured items for the Home page. On failure it falls back to the static seed
 * so the landing page never renders empty.
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const staticFeatured = staticProjects.filter((p) => p.featured);
  if (!hasSupabaseEnv()) return staticFeatured;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select(SELECT)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    const mapped = (data as unknown as PortfolioRow[]).map(rowToProject);
    return mapped.length > 0 ? mapped : staticFeatured;
  } catch (e) {
    console.error("[portfolio] featured fetch failed:", e);
    return staticFeatured;
  }
}
