import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import VideoCard from "./VideoCard";
import { getAllVideos } from "../api/video";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Measure the navbar's REAL rendered height instead of guessing a
  // Tailwind spacing class. Updates automatically if the filter row wraps
  // to two lines on narrow screens, or if you ever change the navbar's content.
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    const observer = new ResizeObserver((entries) => {
      setNavHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVideos();
        setVideos(data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Couldn't load videos. Is your backend running?");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans">
      <div ref={navRef}>
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onUploaded={(video) => setVideos((prev) => [video, ...prev])}
        />
      </div>
      <Sidebar open={sidebarOpen} topOffset={navHeight} />

      <main
        className={`transition-all duration-200 px-4 sm:px-6 py-6 ${
          sidebarOpen ? "sm:ml-56" : "sm:ml-16"
        }`}
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
            : videos.map((video) => <VideoCard key={video._id ?? video.id} video={video} />)}
        </div>

        {!loading && !error && videos.length === 0 && (
          <p className="text-sm text-[#8B8D98] mt-10 text-center">No videos yet.</p>
        )}
      </main>
    </div>
  );
}

function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-[#16161D]" />
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-[#16161D] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-[#16161D] rounded w-4/5" />
          <div className="h-3 bg-[#16161D] rounded w-2/5" />
          <div className="h-3 bg-[#16161D] rounded w-3/5" />
        </div>
      </div>
    </div>
  );
}
