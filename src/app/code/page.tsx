"use client";

import Navbar from "./assets/Navbar";
import Hero from "./assets/Hero";
import VideoReveal from "./assets/VideoReveal";
import Services from "./assets/Services";

export default function CodePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="overflow-hidden">
        <Hero />
      </div>
      {/* -mt-24 pulls VideoReveal up to cover the hero bottom gradient gap */}
      <div className="-mt-24">
        <VideoReveal />
      </div>
      <Services />
    </main>
  );
}