import { motion } from "framer-motion";

/*
  Drop-in replacement for the plain comments .map() in WatchPage.
  Wraps the list in a `motion.div` with staggerChildren so each comment
  fades/slides in with a slight delay after the previous one — much less
  jarring than everything appearing at once.

  Usage in WatchPage, replace:
    <div className="flex flex-col gap-5">
      {comments.map((c) => ( ... ))}
    </div>
  with:
    <CommentList comments={comments} />
*/

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function CommentList({ comments }) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {comments.map((c) => (
        <motion.div key={c._id ?? c.id} variants={itemVariants} className="flex gap-3">
          <img
            src={c.owner?.avatar}
            alt={c.owner?.username}
            className="w-9 h-9 rounded-full shrink-0"
          />
          <div>
            <p className="text-xs text-[#8B8D98]">
              <span className="text-[#F5F3EE] font-medium">@{c.owner?.username ?? "user"}</span>
            </p>
            <p className="text-sm mt-1">{c.content}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
