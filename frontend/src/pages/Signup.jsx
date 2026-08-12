import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext"; // 👈 add this import

export default function Signup() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { login } = useAuth();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarChange = (file) => {
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!avatar) {
      setError("Please add a profile picture — it's required by the backend.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      await registerUser(formData);
      await login({ username, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F3EE] font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span
            className="text-2xl tracking-tight font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Twitube<span className="text-[#6C5CE7]">.</span>
          </span>
          <p className="text-sm text-[#8B8D98] mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Avatar picker */}
          <div className="flex justify-center mb-2">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full bg-[#16161D] border-2 border-dashed border-white/15 hover:border-white/30 cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#8B8D98] text-center px-2">Add photo</span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files[0])}
            />
          </div>

          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full name"
            required
            className="bg-[#16161D] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C5CE7] transition-colors"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="bg-[#16161D] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#6C5CE7] transition-colors"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-[#8B8D98] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6C5CE7] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
