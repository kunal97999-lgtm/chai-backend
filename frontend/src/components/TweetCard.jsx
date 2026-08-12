import { useState } from "react";
import { motion } from "framer-motion";

/*
  Single tweet card. Optimistic like toggle (same pattern as the video
  like button) — flips UI immediately, rolls back if the API call fails.

  Usage: <TweetCard tweet={tweet} onLikeToggle={handleLikeToggle} />
*/

export default function TweetCard({ tweet, onLikeToggle }) {
  const [liked, setLiked] = useState(Boolean(tweet.isLiked));
  const [likeCount, setLikeCount] = useState(tweet.likesCount ?? 0);
  const [retweeted, setRetweeted] = useState(false);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      await onLikeToggle?.(tweet._id ?? tweet.id);
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  return (
    <div className="flex gap-3 px-4 py-4 border-b border-white/10">
      <img
        src={tweet.owner?.avatar}
        alt={tweet.owner?.username}
        className="w-10 h-10 rounded-full shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium text-[#F5F3EE]">{tweet.owner?.fullname ?? tweet.owner?.username}</span>
          <span className="text-[#8B8D98]">@{tweet.owner?.username}</span>
          <span className="text-[#8B8D98]">·</span>
          <span className="text-[#8B8D98]">{timeAgo(tweet.createdAt)}</span>
        </div>

        <p className="text-sm mt-1 leading-relaxed whitespace-pre-wrap">{tweet.content}</p>

        <div className="flex items-center gap-6 mt-3 text-[#8B8D98]">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`relative flex items-center gap-1.5 text-xs transition-colors ${
              liked ? "text-[#e0245e]" : "hover:text-[#e0245e]"
            }`}
          >
            <motion.span
              key={liked}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 12 }}
              className="inline-block"
            >
              {liked ? "❤️" : "🤍"}
            </motion.span>
            {likeCount}
          </button>

          {/* Retweet */}
          <button
            onClick={() => setRetweeted(!retweeted)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              retweeted ? "text-[#17bf63]" : "hover:text-[#17bf63]"
            }`}
          >
            <motion.span
              animate={{ rotate: retweeted ? 360 : 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block"
            >
              🔁
            </motion.span>
            {retweeted ? "Retweeted" : "Retweet"}
          </button>

          {/* Reply (visual only for now) */}
          <button className="flex items-center gap-1.5 text-xs hover:text-[#6C5CE7] transition-colors">
            💬 Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
