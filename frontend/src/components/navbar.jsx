import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import UploadModal from "./uploadModel";

const filters = ["All", "Coding", "Music", "Live", "Tech reviews", "Gaming", "Podcasts"];

// onUploaded: optional callback bubbled up from HomeLayout so it can refetch
// the video list right after a successful upload, without a full page reload.
export default function Navbar({ sidebarOpen, onToggleSidebar, onUploaded }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#0B0B0F]/95 backdrop-blur border-b border-white/10">
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <span className="block w-5 h-0.5 bg-[#F5F3EE] mb-1"></span>
              <span className="block w-5 h-0.5 bg-[#F5F3EE] mb-1"></span>
              <span className="block w-5 h-0.5 bg-[#F5F3EE]"></span>
            </button>
            <span className="text-xl tracking-tight font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Twitube<span className="text-[#6C5CE7]">.</span>
            </span>
          </div>

          <div className="hidden sm:flex flex-1 max-w-xl mx-6">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#16161D] border border-white/10 rounded-full px-4 py-2 text-sm text-[#F5F3EE] placeholder-[#8B8D98] outline-none focus:border-[#6C5CE7] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUploadOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#6C5CE7] text-sm font-medium hover:bg-[#5b4bd6] transition-colors"
            >
              Upload
            </button>
            <img src="https://picsum.photos/seed/me/32/32" alt="Your avatar" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeFilter === filter ? "bg-[#F5F3EE] text-[#0B0B0F] font-medium" : "bg-[#16161D] text-[#F5F3EE] hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence>
        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onUploaded={(video) => {
              onUploaded?.(video);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
