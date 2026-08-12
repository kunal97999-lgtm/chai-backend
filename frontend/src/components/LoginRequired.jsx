import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginRequired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md"
      >
        {/* Lock Icon */}
        <div className="w-20 h-20 rounded-full bg-[#1A1A2E] border border-[#2A2A3E] flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1C9.24 1 7 3.24 7 6v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z"
              fill="#7C6AF7"
            />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
        <p className="text-[#8B8D98] text-sm mb-8 leading-relaxed">
          You need to be signed in to access this page.
          <br />
          Join Twitube to watch, upload, and interact.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-3 rounded-xl bg-[#7C6AF7] hover:bg-[#6A59E0] text-white font-semibold text-sm transition-all duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 py-3 rounded-xl border border-[#2A2A3E] hover:border-[#7C6AF7] text-[#8B8D98] hover:text-white font-semibold text-sm transition-all duration-200"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}