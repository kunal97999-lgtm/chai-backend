import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans flex flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl mb-4">🧭</span>
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        This page doesn't exist yet
      </h1>
      <p className="text-sm text-[#8B8D98] max-w-sm mb-6">
        Either the link is broken, or this is a page we haven't built out yet
        (like Subscriptions, History, or Playlists).
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5b4bd6] text-sm font-medium transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
