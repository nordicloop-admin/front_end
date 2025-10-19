"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// Showcase video with custom controls & seek bar
const ShowcaseVideo: React.FC<{ src: string; poster?: string; title?: string; }> = ({ src, poster, title }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false); // paused because out of view
  const [userPaused, setUserPaused] = useState(false); // user explicitly paused

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
      setUserPaused(false);
      setAutoPaused(false);
    } else {
      v.pause();
      setIsPlaying(false);
      setUserPaused(true);
    }
  };
  // Pause when scrolled away, resume when back (if not user-paused)
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const v = videoRef.current;
        if (!v) return;
        // When sufficiently visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (autoPaused && !userPaused) {
            v.play();
            setIsPlaying(true);
            setAutoPaused(false);
          }
        } else {
          // Out of view: auto pause (only if playing & not user-paused)
          if (!v.paused && !userPaused) {
            v.pause();
            setIsPlaying(false);
            setAutoPaused(true);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [autoPaused, userPaused]);

  const toggleMute = () => {
    const v = videoRef.current; if (!v) return; v.muted = !v.muted; setIsMuted(v.muted);
  };

  const handleLoaded = () => {
    const v = videoRef.current; if (!v) return; setDuration(v.duration || 0);
  };
  const handleTime = () => {
    if (isSeeking) return; // avoid UI jitter while dragging
    const v = videoRef.current; if (!v) return; setCurrent(v.currentTime);
  };

  const formatTime = (t: number) => {
    const mm = Math.floor(t / 60); const ss = Math.floor(t % 60); return `${mm}:${ss.toString().padStart(2,'0')}`;
  };

  const percent = duration ? (current / duration) * 100 : 0;

  const seekTo = (clientX: number, target: HTMLDivElement) => {
    const v = videoRef.current; if (!v) return;
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = ratio * duration;
    setCurrent(v.currentTime);
  };

  return (
  <div ref={containerRef} className="group relative w-full">
      <div className="relative rounded-2xl bg-white  ring-1 ring-gray-200/60 overflow-hidden">
        <div className="relative w-full aspect-[16/9]">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={src}
            poster={poster}
            playsInline
            loop
            muted={isMuted}
            autoPlay
            onLoadedMetadata={handleLoaded}
            onTimeUpdate={handleTime}
            aria-label={title || 'Marketplace material workflow demonstration'}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            Demo
          </div>
          {/* Unified bottom control bar */}
          <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex items-center gap-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 9v6h4l5 5V4L9 9H5z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 9v6h4l5 5V4L9 9H5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3.5 3.5 0 010 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a7 7 0 010 10" /></svg>
              )}
            </button>
            {/* Seek bar */}
            <div className="flex-grow flex items-center select-none" aria-label="Video progress">
              <div
                className="relative w-full h-2 cursor-pointer"
                onMouseDown={(e) => { setIsSeeking(true); seekTo(e.clientX, e.currentTarget as HTMLDivElement); }}
                onMouseMove={(e) => { if (isSeeking) seekTo(e.clientX, e.currentTarget as HTMLDivElement); }}
                onMouseUp={() => setIsSeeking(false)}
                onMouseLeave={() => isSeeking && setIsSeeking(false)}
              >
                <div className="absolute inset-0 rounded-full bg-white/25" />
                <div className="absolute inset-y-0 left-0 rounded-full bg-[#FF8A00]" style={{ width: `${percent}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#FF8A00] shadow ring-2 ring-white/70"
                  style={{ left: `calc(${percent}% - 6px)` }}
                />
              </div>
            </div>
            <div className="text-[11px] font-medium text-white/90 bg-white/10 px-2 py-1 rounded-md">
              {formatTime(current)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketplaceSection = () => {
  return (
    // Match hero width: use section-margin + full-width grid similar spacing
    <section className="py-12 lg:py-16 mx-7">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 w-full">
        <div className="order-2 lg:order-1 flex flex-col justify-center items-start w-full">
            <h3 className="text-md md:text-md font-semibold mb-3 text-[#1E2A36]">Waste Marketplace</h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1E2A36]">
              Discover Endless Recycling And <br className="hidden md:block"/> Material-Sourcing Opportunities!
            </h2>
            <p className="text-[#666666] mb-6 text-sm md:text-base">
              Whether you&apos;re on the search for high-quality recyclable materials
              or dependable recycling partners, our marketplace has you
              covered. Best of all, it&apos;s free to join!<br/>
              Dive into a world of innovative tools designed to help you achieve
              and exceed your sustainability goals.
            </p>

            <Link
              href="/market-place"
              className="bg-[#FF8A00] text-white px-8 py-4 w-[200px] rounded-md hover:bg-[#e67e00] transition-colors inline-block text-center text-sm font-medium"
            >
              Market place
            </Link>
        </div>
        <div className="order-1 lg:order-2 relative flex items-center justify-center w-full">
          <ShowcaseVideo
            src="https://pub-7515a715eee34bd9ab26b28cbe2f7fa1.r2.dev/General%20Resources/Nordic%20Loop%20Tutorial%20.mp4"
            poster="/hero-image.jpg"
            title="Nordic Loop Material Listing Flow"
          />
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
