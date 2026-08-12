import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const isEmail = identifier.includes("@");
      await login({
        email: isEmail ? identifier : undefined,
        username: isEmail ? undefined : identifier,
        password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span
            className="text-2xl tracking-tight font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Twitube<span className="text-[#6C5CE7]">.</span>
          </span>
          <p className="text-sm text-[#8B8D98] mt-2">Log in to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or username"
            required
            className="bg-[#16161D] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C5CE7] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="bg-[#16161D] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C5CE7] transition-colors"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-[#6C5CE7] hover:bg-[#5b4bd6] transition-colors rounded-full py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-[#8B8D98] mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#6C5CE7] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
