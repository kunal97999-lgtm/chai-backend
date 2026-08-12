import { motion, AnimatePresence } from "framer-motion";

/*
  Drop-in replacement for a plain like button.
  - Icon does a quick overshoot scale pop on click (spring, not linear).
  - A small "+1" floats up and fades when you like it (optional flourish,
    remove the AnimatePresence block if you want it simpler).

  Usage:
    <LikeButton liked={liked} count={likesCount} onToggle={handleLike} />
*/

export default function LikeButton({ liked, count, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-[#16161D] transition-colors ${
        liked ? "text-[#6C5CE7]" : "hover:bg-white/5"
      }`}
    >
      <motion.span
        key={liked} // remounts on toggle so the animation replays every click
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
        className="inline-block"
      >
        👍
      </motion.span>
      <span>{count}</span>

      <AnimatePresence>
        {liked && (
          <motion.span
            key="float"
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -20, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-[#6C5CE7] pointer-events-none"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
