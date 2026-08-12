import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TweetCard from "../components/TweetCard";
import { getAllTweets, createTweet, toggleTweetLike } from "../api/tweet";
import { useAuth } from "../context/AuthContext";

export default function TweetFeed() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllTweets();
        if (!ignore) setTweets(data);
      } catch {
        if (!ignore) setError("Couldn't load tweets. Is your backend running?");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const newTweet = await createTweet(content.trim());
      setTweets((prev) => [{ ...newTweet, owner: newTweet.owner ?? user }, ...prev]);
      setContent("");
    } catch {
      setError("Couldn't post your tweet. Try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleLikeToggle = (tweetId) => toggleTweetLike(tweetId);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} />

      <main
        className={`pt-24 transition-all duration-200 px-0 ${
          sidebarOpen ? "sm:ml-56" : "sm:ml-16"
        }`}
      >
        <div className="max-w-2xl mx-auto border-x border-white/10 min-h-screen">
          <h1
            className="text-lg font-semibold px-4 py-4 border-b border-white/10"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Tweets
          </h1>

          {error && (
            <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Composer */}
          <form onSubmit={handlePost} className="flex gap-3 px-4 py-4 border-b border-white/10">
            <img
              src={user?.avatar ?? "https://picsum.photos/seed/me/40/40"}
              alt="You"
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                rows={2}
                disabled={posting}
                className="w-full bg-transparent text-sm outline-none resize-none placeholder-[#8B8D98] disabled:opacity-50"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || posting}
                  className="px-4 py-1.5 rounded-full bg-[#6C5CE7] hover:bg-[#5b4bd6] text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {posting ? "Posting..." : "Tweet"}
                </button>
              </div>
            </div>
          </form>

          {/* Feed */}
          {loading ? (
            <div className="flex flex-col">
              {Array.from({ length: 4 }).map((_, i) => (
                <TweetSkeleton key={i} />
              ))}
            </div>
          ) : tweets.length === 0 ? (
            <p className="text-sm text-[#8B8D98] text-center py-10">No tweets yet. Say something!</p>
          ) : (
            <AnimatePresence initial={false}>
              {tweets.map((tweet) => (
                <motion.div
                  key={tweet._id ?? tweet.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TweetCard tweet={tweet} onLikeToggle={handleLikeToggle} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

function TweetSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-white/10 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-[#16161D] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#16161D] rounded w-1/3" />
        <div className="h-3 bg-[#16161D] rounded w-4/5" />
        <div className="h-3 bg-[#16161D] rounded w-2/5" />
      </div>
    </div>
  );
}
