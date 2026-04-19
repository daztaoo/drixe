import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PublicProfileView from "@/components/PublicProfileView";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const decodedName = decodeURIComponent(username);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .ilike("username", decodedName)
    .limit(1)
    .maybeSingle();

  if (!profile) return { title: "User Not Found" };

  return {
    title: `${profile.full_name || profile.username} (@${profile.username}) | Drixe`,
    description: profile.bio || `Check out ${profile.username}'s profile on Drixe.`,
    openGraph: {
      title: `@${profile.username} | Drixe`,
      description: profile.bio || "Living profile on Drixe.",
    },
  };
}

// ─── Smart Link Priority ───────────────────────────────────────────────────────
// When a user is LIVE on Twitch or YouTube, that link floats to the top.
function sortLinksWithLivePriority(links: any[], integrations: any[]) {
  const liveIntegrations = integrations.filter((i) => i.is_live && i.is_enabled);

  return [...links].sort((a, b) => {
    const aIsLive = liveIntegrations.some((i) => {
      if (i.platform === "twitch" && i.platform_username)
        return a.url?.toLowerCase().includes(`twitch.tv/${i.platform_username.toLowerCase()}`);
      if (i.platform === "youtube" && i.is_live)
        return a.url?.includes("youtube.com") || a.url?.includes("youtu.be");
      return false;
    });
    const bIsLive = liveIntegrations.some((i) => {
      if (i.platform === "twitch" && i.platform_username)
        return b.url?.toLowerCase().includes(`twitch.tv/${i.platform_username.toLowerCase()}`);
      if (i.platform === "youtube" && i.is_live)
        return b.url?.includes("youtube.com") || b.url?.includes("youtu.be");
      return false;
    });

    if (aIsLive && !bIsLive) return -1;
    if (!aIsLive && bIsLive) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  const decodedName = decodeURIComponent(username);

  // A. Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", decodedName)
    .limit(1)
    .maybeSingle();

  if (!profile) return notFound();

  // B. Links
  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, display_order")
    .eq("profile_id", profile.id)
    .order("display_order", { ascending: true });

  // C. Integrations — only public-safe columns (NO tokens)
  const { data: integrations } = await supabase
    .from("integrations")
    .select(
      "id, platform, platform_user_id, platform_username, is_enabled, show_on_profile, is_live, live_title, live_viewer_count, live_video_url"
    )
    .eq("user_id", profile.id)
    .eq("is_enabled", true);

  const intData = integrations ?? [];

  // D. Smart Link Priority — LIVE links go to top
  const sortedLinks = sortLinksWithLivePriority(links ?? [], intData);

  return (
    <PublicProfileView
      profile={profile}
      links={sortedLinks}
      integrations={intData}
    />
  );
}

