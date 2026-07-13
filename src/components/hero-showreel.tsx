"use client";

import { useEffect, useRef } from "react";

export function HeroShowreel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyMotionPreference() {
      if (!video) return;
      if (motionPreference.matches) video.pause();
      else void video.play().catch(() => undefined);
    }

    applyMotionPreference();
    motionPreference.addEventListener("change", applyMotionPreference);
    return () => motionPreference.removeEventListener("change", applyMotionPreference);
  }, []);

  return (
    <figure className="video-hero-showreel">
      <div className="video-hero-media">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          poster="/images/video-production/showreel-poster.jpg"
          aria-describedby="showreel-caption"
        >
          <source src="/video/vantalume-ai-video-showreel.mp4" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <span className="video-hero-badge">Vantalume showreel</span>
      </div>
      <figcaption id="showreel-caption">
        <span>AI video production</span>
        <span>Vertical campaign · 00:30</span>
      </figcaption>
    </figure>
  );
}
