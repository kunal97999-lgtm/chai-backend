import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import TweetCard from "../components/TweetCard";
import { getChannelProfile } from "../api/user";
import { getVideosByOwner, toggleSubscribe } from "../api/video";
import { getTweetsByUser, toggleTweetLike } from "../api/tweet";

const tabs = ["Videos", "Tweets", "About"];

export default function ChannelPage() {
  const { username } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [channel, setChannel] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");

  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load channel profile once
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChannelProfile(username);
        if (!ignore) {
          setChannel(data);
          setSubscribed(Boolean(data.isSubscribed));
        }
      } catch {
        if (!ignore) setError("Couldn't load this channel.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [username]);

  // Load tab content when channel is known or tab changes
  useEffect(() => {
    if (!channel) return;
    const channelId = channel._id ?? channel.id;
    let ignore = false;

    const loadTab = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "Videos" && videos.length === 0) {
          const data = await getVideosByOwner(channelId);
          if (!ignore) setVideos(data);
        }
        if (activeTab === "Tweets" && tweets.length === 0) {
          const data = await getTweetsByUser(channelId);
          if (!ignore) setTweets(data);
        }
      } catch {
        // non-fatal — tab just shows empty state
      } finally {
        if (!ignore) setTabLoading(false);
      }
    };
    loadTab();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, activeTab]);

  const handleSubscribe = async () => {
    setSubscribed((prev) => !prev);
    try {
      await toggleSubscribe(channel._id ?? channel.id);
    } catch {
      setSubscribed((prev) => !prev);
    }
  };

  if (loading) return <ChannelSkeleton />;

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] flex items-center justify-center">
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          {error ?? "Channel not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} />

      <main className={`pt-16 transition-all duration-200 ${sidebarOpen ? "sm:ml-56" : "sm:ml-16"}`}>
        {/* Cover image */}
        <div className="w-full h-40 sm:h-56 bg-[#16161D] overflow-hidden">
          {channel.coverImage && (
            <img src={channel.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Channel header */}
        <div className="px-4 sm:px-6 -mt-10 flex items-end gap-4">
          <img
            src={channel.avatar}
            alt={channel.username}
            className="w-24 h-24 rounded-full border-4 border-[#0B0B0F] object-cover"
          />
        </div>

        <div className="px-4 sm:px-6 mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {channel.fullName ?? channel.fullname ?? channel.username}
            </h1>
            <p className="text-sm text-[#8B8D98]">
              @{channel.username} • {channel.subscribersCount ?? 0} subscribers
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              subscribed
                ? "bg-[#16161D] text-[#F5F3EE] border border-white/10"
                : "bg-[#6C5CE7] hover:bg-[#5b4bd6]"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 mt-6 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-[#F5F3EE]" : "text-[#8B8D98] hover:text-[#F5F3EE]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="channelTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C5CE7]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-4 sm:px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tabLoading ? (
                <p className="text-sm text-[#8B8D98]">Loading...</p>
              ) : activeTab === "Videos" ? (
                videos.length === 0 ? (
                  <p className="text-sm text-[#8B8D98]">No videos yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {videos.map((v) => (
                      <VideoCard key={v._id ?? v.id} video={v} />
                    ))}
                  </div>
                )
              ) : activeTab === "Tweets" ? (
                tweets.length === 0 ? (
                  <p className="text-sm text-[#8B8D98]">No tweets yet.</p>
                ) : (
                  <div className="max-w-2xl">
                    {tweets.map((t) => (
                      <TweetCard key={t._id ?? t.id} tweet={t} onLikeToggle={toggleTweetLike} />
                    ))}
                  </div>
                )
              ) : (
                <div className="max-w-lg text-sm text-[#8B8D98] leading-relaxed">
                  {channel.bio || "This channel hasn't added a bio yet."}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="w-full h-40 sm:h-56 bg-[#16161D] animate-pulse" />
      <div className="px-6 -mt-10 flex items-end gap-4">
        <div className="w-24 h-24 rounded-full bg-[#16161D] border-4 border-[#0B0B0F] animate-pulse" />
      </div>
      <div className="px-6 mt-3 space-y-2">
        <div className="h-5 bg-[#16161D] rounded w-1/4 animate-pulse" />
        <div className="h-3 bg-[#16161D] rounded w-1/6 animate-pulse" />
      </div>
    </div>
  );
}
