/* ------------------------------------------------------------------ */
/*  LOOPSOOP — content model                                           */
/*  Single source of truth for copy shown across the site.            */
/* ------------------------------------------------------------------ */

export const site = {
  name: "LOOPSOOP",
  tagline: "Edit. Connect. Elevate.",
  domain: "loopsoop.in",
  url: "https://loopsoop.in",
  description:
    "Loopsoop is a premium video editing production company delivering high-end edits for creators, brands and businesses.",
  email: "hello@loopsoop.in",
  phone: "+91 98765 43210",
  phoneHref: "+919876543210",
  hours: "Mon – Sat, 10AM – 8PM IST",
  discord: "discord.gg/loopsoop",
  discordHref: "https://discord.gg/loopsoop",
  location: "Remote First",
  socials: {
    instagram: "https://instagram.com/loopsoop",
    youtube: "https://youtube.com/@loopsoop",
    linkedin: "https://linkedin.com/company/loopsoop",
    discord: "https://discord.gg/loopsoop",
  },
} as const;

/* Visible primary navigation.
   Hidden-but-live routes (kept functional, intentionally not listed here):
   - /our-work    → the portfolio "engine" (reached via Our Editing categories)
   - /clients     → Past Clients (re-enable later by adding it back) */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Our Editing", href: "/our-editing" },
  { label: "About", href: "/about" },
] as const;

/* Monochrome brand wordmarks for the "trusted by" strips.
   `style` maps to a small set of typographic treatments in <BrandMark>. */
export type Brand = { name: string; style?: "serif" | "italic" | "wide" | "black" };

export const trustedHome: Brand[] = [
  { name: "boAt", style: "black" },
  { name: "PUMA", style: "italic" },
  { name: "PHILIPS", style: "wide" },
  { name: "zomato", style: "italic" },
  { name: "AJIO", style: "wide" },
  { name: "slice" },
  { name: "unacademy" },
  { name: "Groww", style: "black" },
];

export const trustedClients: Brand[] = [
  { name: "boAt", style: "black" },
  { name: "PUMA", style: "italic" },
  { name: "Coca-Cola", style: "serif" },
  { name: "ZEE5", style: "black" },
  { name: "slice" },
  { name: "AMP", style: "wide" },
  { name: "JBL", style: "black" },
  { name: "Meesho", style: "italic" },
];

/* Portfolio categories (home) */
export type Category = { label: string; icon: string };

export const categories: Category[] = [
  { label: "YouTube Videos", icon: "monitor-play" },
  { label: "Short Form Content", icon: "smartphone" },
  { label: "Ads & Commercials", icon: "megaphone" },
  { label: "Corporate Videos", icon: "briefcase" },
  { label: "Weddings", icon: "heart" },
  { label: "Documentary", icon: "clapperboard" },
];

/* Projects — used across Home (featured) and Our Work (all) */
export type Project = {
  id: string;
  title: string;
  category: string; // display label
  filter: string; // matches a filter chip on /our-work (an editingCategories name)
  seed: number; // deterministic placeholder variation
  featured?: boolean;
};

export const projects: Project[] = [
  { id: "boat-airdopes", title: "boAt Airdopes 141", category: "Product Ad", filter: "Commercial", seed: 3, featured: true },
  { id: "finance-simplified", title: "Finance Simplified", category: "YouTube Video", filter: "Educational", seed: 12, featured: true },
  { id: "puma-ignite", title: "PUMA Ignite Campaign", category: "Commercial", filter: "Commercial", seed: 21, featured: true },
  { id: "karan-ananya", title: "Karan & Ananya", category: "Wedding Film", filter: "Emotional", seed: 33, featured: true },
  { id: "luxury-redefined", title: "Luxury Redefined", category: "Real Estate Video", filter: "Luxury", seed: 44, featured: true },
  { id: "true-north", title: "True North", category: "Travel Documentary", filter: "Documentary", seed: 51, featured: true },
  { id: "coca-cola-zero", title: "Coca-Cola Zero", category: "Commercial", filter: "Commercial", seed: 63 },
  { id: "nexgen-app", title: "NexGen App Launch", category: "Product Video", filter: "Corporate", seed: 72 },
  { id: "ride-beyond", title: "Ride Beyond", category: "Brand Film", filter: "Fast Pace", seed: 84 },
  { id: "minimalist-skincare", title: "Minimalist Skincare", category: "Product Ad", filter: "Social Media", seed: 91 },
  { id: "no-limits", title: "No Limits", category: "Fitness Campaign", filter: "Short Form", seed: 7 },
  { id: "urban-frames", title: "Urban Frames", category: "Cinematic Reel", filter: "Documentary", seed: 18 },
];

/* Unified editing categories.
   One taxonomy shown as cards on Our Editing, used as the Our Work filter
   chips, and referenced by ?category=<slug> deep links. Every project's
   `filter` matches one of these `name`s. Add/rename here to update everywhere. */
export type EditingCategory = {
  slug: string;
  name: string;
  description: string;
  seed: number;
};

export const editingCategories: EditingCategory[] = [
  { slug: "documentary", name: "Documentary", description: "Natural, raw and real edits that keep the story authentic.", seed: 51 },
  { slug: "commercial", name: "Commercial", description: "Punchy, high-converting ads and brand films that sell.", seed: 21 },
  { slug: "corporate", name: "Corporate", description: "Polished, professional edits for brands and businesses.", seed: 72 },
  { slug: "emotional", name: "Emotional", description: "Heartfelt storytelling with soulful music and cinematic flow.", seed: 33 },
  { slug: "fast-pace", name: "Fast Pace", description: "High-energy cuts, quick transitions and impactful beats.", seed: 84 },
  { slug: "luxury", name: "Luxury", description: "Elegant, refined edits with a premium, high-end feel.", seed: 44 },
  { slug: "educational", name: "Educational", description: "Clear, engaging edits that make complex ideas easy to follow.", seed: 12 },
  { slug: "social-media", name: "Social Media", description: "Scroll-stopping edits optimised for reach and engagement.", seed: 91 },
  { slug: "short-form", name: "Short Form", description: "Snappy reels and shorts built for vertical, bite-sized viewing.", seed: 7 },
];

/* Translate between a ?category= slug and its display name. */
export const categorySlugToName = (slug?: string | null): string | null =>
  editingCategories.find((c) => c.slug === slug)?.name ?? null;

export const categoryNameToSlug = (name: string): string | null =>
  editingCategories.find((c) => c.name === name)?.slug ?? null;

/* Filter chips on Our Work: "All Work" + every category. */
export const workFilters: string[] = [
  "All Work",
  ...editingCategories.map((c) => c.name),
];

/* Editing styles — compact list (home) */
export const stylesShort = [
  "Cinematic",
  "Clean & Minimal",
  "High Energy",
  "Moody & Dark",
  "Smooth & Elegant",
  "Colorful & Vibrant",
];

export const styleIncludes = [
  { icon: "zap", title: "Smooth Transitions", description: "Seamless cuts and transitions that keep your audience hooked." },
  { icon: "palette", title: "Color Grading", description: "Cinematic color correction that brings your story to life." },
  { icon: "type", title: "Motion Typography", description: "Clean, modern and animated text that adds impact." },
  { icon: "music", title: "Sound Design", description: "Perfect sync with music and sound effects." },
  { icon: "monitor", title: "Optimized Delivery", description: "High quality exports for every platform." },
];

/* Stats bands */
export const statsMain = [
  { value: "300+", label: "Projects Completed", icon: "clapperboard" },
  { value: "150+", label: "Happy Clients", icon: "smile" },
  { value: "500M+", label: "Views Generated", icon: "play" },
  { value: "25+", label: "Countries Served", icon: "globe" },
];

export const statsWork = [
  { value: "250+", label: "Projects Completed", icon: "clapperboard" },
  { value: "50+", label: "Happy Clients", icon: "star" },
  { value: "100M+", label: "Views Generated", icon: "play" },
  { value: "5+", label: "Years of Experience", icon: "clock" },
];

/* Testimonials (clients) */
export type Testimonial = {
  brand: string;
  project: string;
  quote: string;
  name: string;
  role: string;
  seed: number;
};

export const testimonials: Testimonial[] = [
  {
    brand: "boAt",
    project: "Airdopes 141",
    quote:
      "Loopsoop completely transformed our raw footage into a crisp, high-converting ad that performed beyond our expectations.",
    name: "Aman Gupta",
    role: "Co-Founder, boAt",
    seed: 3,
  },
  {
    brand: "Puma",
    project: "Campaign Film",
    quote:
      "Super professional team with insane attention to detail. They understood the vision and brought it to life.",
    name: "Sejal Shah",
    role: "Marketing Lead, PUMA India",
    seed: 27,
  },
  {
    brand: "Slice",
    project: "Brand Film",
    quote:
      "The edits were slick, modern and matched our brand perfectly. Loopsoop is now our go-to editing partner.",
    name: "Rajat Verma",
    role: "Growth Lead, Slice",
    seed: 72,
  },
];

/* About — mission values */
export const values = [
  { icon: "book-open", title: "Story First", description: "We focus on the story, craft the edit around emotion and keep the audience hooked." },
  { icon: "search-check", title: "Detail Obsessed", description: "From transitions to color grading, every detail is designed to perfection." },
  { icon: "trending-up", title: "Results Driven", description: "We don't just deliver edits, we deliver impact that drives real results." },
];

/* About / process */
export const processSteps = [
  { n: "01", icon: "message-circle", title: "Discover", description: "We understand your goals, vision and target audience." },
  { n: "02", icon: "folder", title: "Plan", description: "We plan the flow, style and structure for maximum impact." },
  { n: "03", icon: "scissors", title: "Edit", description: "Our editors bring the story to life with creativity." },
  { n: "04", icon: "wand-sparkles", title: "Refine", description: "We fine-tune every detail until it's perfect." },
  { n: "05", icon: "send", title: "Deliver", description: "On-time delivery, optimized and ready to perform." },
];

/* About / team */
export type Member = { name: string; role: string; seed: number };

export const team: Member[] = [
  { name: "Ritik Verma", role: "Founder & Creative Director", seed: 15 },
  { name: "Arnav Sharma", role: "Lead Editor", seed: 41 },
  { name: "Kunal Mehta", role: "Motion Graphics Artist", seed: 66 },
  { name: "Sejal Rao", role: "Color Grading Specialist", seed: 88 },
];

/* Contact — project types + FAQ */
export const projectTypes = [
  "YouTube Video",
  "Short-Form / Reels",
  "Commercial / Ad",
  "Corporate Video",
  "Documentary",
  "Wedding Film",
  "Real Estate",
  "Other",
];

export const faqs = [
  {
    q: "What types of videos do you edit?",
    a: "From YouTube videos, short-form reels and commercials to corporate films, documentaries, weddings and real-estate walkthroughs — if it needs an edit, we craft it.",
  },
  {
    q: "How long does a typical project take?",
    a: "Most projects are delivered within 3–7 days depending on length and complexity. Short-form edits often turn around in 48 hours.",
  },
  {
    q: "What do you need to get started?",
    a: "Your raw footage, any brand assets or references, and a short brief on the vision. We handle the rest from concept to final delivery.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes. Every project includes multiple revision rounds so the final edit matches your vision perfectly.",
  },
];
