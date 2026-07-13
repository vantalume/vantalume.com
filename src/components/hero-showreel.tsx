"use client";

import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function HeroShowreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyMotionPreference() {
      if (!video) return;
      if (motionPreference.matches) video.pause();
      else void video.play().catch(() => setIsPlaying(false));
    }

    applyMotionPreference();
    motionPreference.addEventListener("change", applyMotionPreference);
    return () => motionPreference.removeEventListener("change", applyMotionPreference);
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }

  function handlePlay() {
    setIsPlaying(true);
    if (startedRef.current) return;
    startedRef.current = true;
    trackAnalyticsEvent("video_start", { video_title: "AI Video Production showreel" });
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || completedRef.current || !video.duration) return;
    if (video.currentTime >= video.duration - 0.5) {
      completedRef.current = true;
      trackAnalyticsEvent("video_complete", { video_title: "AI Video Production showreel" });
    }
  }

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
          onPlay={handlePlay}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src="/video/vantalume-ai-video-showreel.mp4" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <button
          type="button"
          className={`video-play-button${isPlaying ? " is-playing" : ""}`}
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause Vantalume showreel" : "Play Vantalume showreel"}
        >
          <span aria-hidden="true">{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <span className="video-hero-badge">Vantalume showreel</span>
      </div>
      <figcaption id="showreel-caption">
        <span>AI video production</span>
        <span>Vertical campaign · 00:30</span>
      </figcaption>
    </figure>
  );
}
