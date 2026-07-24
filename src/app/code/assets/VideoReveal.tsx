"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function VideoReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Guaranteed Autoplay Handshake ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Force native DOM properties for browser autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Autoplay error:", error);
      }
    };

    // 2. Play immediately if ready, or wait for buffer
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
    }
  }, []);

  // Tracks scroll progression as section enters viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Snappy spring response
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // ── Video Card Transforms ──────────────────────────
  const width = useTransform(smooth, [0.1, 0.95], ["75%", "100%"]);
  const height = useTransform(smooth, [0.1, 0.95], ["75vh", "100vh"]);
  const topMargin = useTransform(smooth, [0.1, 0.95], ["25vh", "0vh"]);
  const radius = useTransform(smooth, [0.1, 0.8], [20, 0]);

  // Dark overlay fades out quickly on entry
  const overlayOpacity = useTransform(smooth, [0.1, 0.5], [0.35, 0]);

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-[#121212]">
      {/* ── Sticky Viewport Window ── */}
      <div className="sticky top-0 flex h-screen w-full justify-center overflow-hidden bg-[#121212]">
        
        {/* ── Expanding Video Card ── */}
        <motion.div
          style={{
            width,
            height,
            marginTop: topMargin,
            borderRadius: radius,
          }}
          className="relative flex-shrink-0 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        >
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            {/* If using your local file, put it in public/codm.mp4 */}
            <source src="/codm.gif" type="video/mp4" />

            {/* Reliable CDN fallback */}
            <source
              src="https://cdn.coverr.co/videos/coverr-aerial-view-of-city-lights-at-night-1616/1080p.mp4"
              type="video/mp4"
            />
          </video>

          {/* Ambient Brand Gradient Overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(18,18,18,0.2) 100%)",
            }}
          />

          {/* Entry Fade Mask */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="pointer-events-none absolute inset-0 bg-[#121212]"
          />
        </motion.div>

      </div>
    </div>
  );
}