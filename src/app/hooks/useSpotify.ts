"use client";
import { useEffect, useState } from "react";

export function useSpotify() {
  const [now, setNow] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [n, r, t] = await Promise.all([
        fetch("/api/spotify/now-playing").then(r => r.json()),
        fetch("/api/spotify/recent").then(r => r.json()),
        fetch("/api/spotify/top").then(r => r.json()),
      ]);

      setNow(n);
      setRecent(r);
      setTop(t);
    };

    fetchAll();
  }, []);

  return { now, recent, top };
}
