import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, toggleVideoLike, toggleSubscribe } from "../api/video";
import { getComments, addComment } from "../api/comment";

export default function WatchPage() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [videoData, commentsData] = await Promise.all([
          getVideoById(id),
          getComments(id),
        ]);
        if (!ignore) {
          setVideo(videoData);
          setComments(commentsData);
          setLiked(Boolean(videoData?.isLiked));
          setSubscribed(Boolean(videoData?.owner?.isSubscribed));
        }
      } catch {
        if (!ignore) setError("Couldn't load this video. Check your backend / video id.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleLike = async () => {
    // optimistic update — flip UI first, roll back if the request fails
    setLiked((prev) => !prev);
    try {
      await toggleVideoLike(id);
    } catch {
      setLiked((prev) => !prev); // revert on failure
    }
  };

  const handleSubscribe = async () => {
    setSubscribed((prev) => !prev);
    try {
      await toggleSubscribe(video.owner._id);
    } catch {
      setSubscribed((prev) => !prev);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const newComment = await addComment(id, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch {
      setError("Couldn't post your comment. Try again.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <WatchPageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] flex items-center justify-center px-4">
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          {error}
        </p>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans px-4 sm:px-6 py-6">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* Adjust field name (videoFile) to match your backend's video URL field */}
          <video
            src={video.videoFile}
            controls
            className="w-full aspect-video bg-black rounded-xl"
          />

          <h1
            className="text-lg sm:text-xl font-semibold mt-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-3">
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="w-11 h-11 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{video.owner?.username}</p>
                <p className="text-xs text-[#8B8D98]">
                  {video.owner?.subscribersCount ?? 0} subscribers
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                className={`ml-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  subscribed
                    ? "bg-[#16161D] text-[#F5F3EE] border border-white/10"
                    : "bg-[#6C5CE7] hover:bg-[#5b4bd6]"
                }`}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-[#16161D] transition-colors ${
                liked ? "text-[#6C5CE7]" : "hover:bg-white/5"
              }`}
            >
              👍 {(video.likesCount ?? 0) + (liked && !video.isLiked ? 1 : 0)}
            </button>
          </div>

          <div className="mt-4 bg-[#16161D] rounded-xl p-3.5 text-sm">
            <p className="text-[#8B8D98] mb-1">{video.views ?? 0} views</p>
            <p className="text-[#F5F3EE] leading-relaxed">{video.description}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium mb-4">{comments.length} Comments</p>

            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                disabled={posting}
                className="flex-1 bg-transparent border-b border-white/10 focus:border-[#6C5CE7] outline-none text-sm pb-1.5 transition-colors disabled:opacity-50"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  disabled={posting}
                  className="text-sm text-[#6C5CE7] font-medium disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Comment"}
                </button>
              )}
            </form>

            <div className="flex flex-col gap-5">
              {comments.map((c) => (
                <div key={c._id ?? c.id} className="flex gap-3">
                  <img
                    src={c.owner?.avatar}
                    alt={c.owner?.username}
                    className="w-9 h-9 rounded-full shrink-0"
                  />
                  <div>
                    <p className="text-xs text-[#8B8D98]">
                      <span className="text-[#F5F3EE] font-medium">
                        @{c.owner?.username ?? "user"}
                      </span>
                    </p>
                    <p className="text-sm mt-1">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] px-4 sm:px-6 py-6">
      <div className="max-w-[1600px] mx-auto animate-pulse">
        <div className="w-full aspect-video bg-[#16161D] rounded-xl" />
        <div className="h-5 bg-[#16161D] rounded w-2/3 mt-4" />
        <div className="h-4 bg-[#16161D] rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}
