import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Sidebar — uses NavLink so the active highlight is driven by the real URL,
  not a hardcoded prop. "Your channel" resolves to the logged-in user's
  own channel page once auth is wired up.
*/

const primaryLinks = [
  { label: "Home", icon: "🏠", to: "/" },
  { label: "Subscriptions", icon: "📺", to: "/subscriptions" },
  { label: "Twitter", icon: "🐦", to: "/twitter" },
];

const bottomLinks = [
  { label: "Liked videos", icon: "👍", to: "/liked" },
  { label: "Downloads", icon: "⬇️", to: "/downloads" },
];

export default function Sidebar({ open = true }) {
  const { user } = useAuth();
  const [youExpanded, setYouExpanded] = useState(true);

  const youLinks = [
    { label: "Your channel", icon: "👤", to: user ? `/channel/${user.username}` : "/login" },
    { label: "History", icon: "🕘", to: "/history" },
    { label: "Playlists", icon: "📋", to: "/playlists" },
    { label: "Your videos", icon: "🎬", to: "/your-videos" },
    { label: "Watch later", icon: "⏰", to: "/watch-later" },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-10 bg-[#0B0B0F] border-r border-white/10 transition-all duration-200 ${
        open ? "w-56" : "w-0 sm:w-16"
      } overflow-y-auto`}
    >
      <nav className="flex flex-col py-2 px-2">
        {primaryLinks.map((link) => (
          <SidebarLink key={link.label} link={link} open={open} />
        ))}
      </nav>

      {open && <div className="border-t border-white/10 mx-2" />}

      {open && (
        <div className="px-2 py-2">
          <button
            onClick={() => setYouExpanded(!youExpanded)}
            className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
          >
            <span>You</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                youExpanded ? "rotate-90" : ""
              }`}
            >
              ›
            </span>
          </button>
          {youExpanded && (
            <nav className="flex flex-col mt-1">
              {youLinks.map((link) => (
                <SidebarLink key={link.label} link={link} open={open} />
              ))}
            </nav>
          )}
        </div>
      )}

      {open && <div className="border-t border-white/10 mx-2" />}

      <nav className="flex flex-col py-2 px-2">
        {bottomLinks.map((link) => (
          <SidebarLink key={link.label} link={link} open={open} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({ link, open }) {
  return (
    <NavLink
      to={link.to}
      end={link.to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-4 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-[#6C5CE7]/15 text-[#6C5CE7] font-medium"
            : "hover:bg-white/5 text-[#F5F3EE]"
        }`
      }
    >
      <span className="text-base w-5 text-center">{link.icon}</span>
      {open && <span className="truncate">{link.label}</span>}
    </NavLink>
  );
}
