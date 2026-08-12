import { Link } from "react-router-dom";

/*
  Extracted from HomeLayout so it can be reused on the channel page too.
  In HomeLayout.jsx, replace the inline VideoCard function with:
    import VideoCard from "./VideoCard";
  and delete the old inline definition.
*/

export default function VideoCard({ video }) {
  const id = video._id ?? video.id;
  const channel = video.owner?.username ?? video.channel ?? "Unknown";
  const avatar = video.owner?.avatar ?? video.avatar;

  return (
    <Link to={`/watch/${id}`} className="group cursor-pointer block">
      <div className="relative rounded-xl overflow-hidden bg-[#16161D]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-full w-1/3 bg-[#6C5CE7]"></div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        {avatar && <img src={avatar} alt={channel} className="w-9 h-9 rounded-full shrink-0" />}
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#6C5CE7] transition-colors">
            {video.title}
          </p>
          <p className="text-xs text-[#8B8D98] mt-1">{channel}</p>
          <p className="text-xs text-[#8B8D98]">
            {video.views ?? 0} views
            {video.createdAt ? ` • ${timeAgo(video.createdAt)}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString();
}
