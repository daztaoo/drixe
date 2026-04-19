import { cn } from "@/lib/utils";

interface Props {
  viewerCount?: number | null;
  className?: string;
}

/**
 * Pulsing red LIVE badge — shown on links when a user is streaming.
 * Includes optional viewer count display.
 */
export function LiveBadge({ viewerCount, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white",
        "bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
        className
      )}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
      </span>
      LIVE
      {viewerCount != null && viewerCount > 0 && (
        <span className="opacity-80">· {viewerCount.toLocaleString()}</span>
      )}
    </span>
  );
}
