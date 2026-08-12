import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVideo } from "../api/video";

/*
  Now performs a REAL upload to your backend (POST /videos, multipart).
  Requires: your backend route needs both a video file AND a thumbnail file
  (typical for this style of backend). If yours only needs a video file,
  delete the thumbnail block below and remove it from the uploadVideo() call
  in api/video.js.

  Requires the user to be logged in (cookie sent automatically via
  withCredentials in the axios instance) — if you get a 401 here, that's why.

  Usage: <UploadModal onClose={...} onUploaded={(video) => ...} />
  onUploaded fires with the created video after a successful upload, so the
  parent can e.g. refetch the home feed or navigate to the new video.
*/

export default function UploadModal({ onClose, onUploaded }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const handleVideoFile = (f) => f && setVideoFile(f);

  const handleThumbFile = (f) => {
    if (!f) return;
    setThumbnail(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleVideoFile(e.dataTransfer.files[0]);
  };

  const startUpload = async () => {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const created = await uploadVideo(
        { videoFile, thumbnail, title, description },
        (pct) => setProgress(pct)
      );
      setDone(true);
      onUploaded?.(created);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "You need to be logged in to upload."
          : err.response?.data?.message || "Upload failed. Try again."
      );
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <motion.div onClick={!uploading ? onClose : undefined} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-full max-w-lg bg-[#16161D] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Upload video
          </h2>
          <button
            onClick={onClose}
            disabled={uploading && !done}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[#8B8D98] disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!videoFile ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => videoInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-14 cursor-pointer transition-colors ${
                dragActive ? "border-[#6C5CE7] bg-[#6C5CE7]/5" : "border-white/15 hover:border-white/30"
              }`}
            >
              <span className="text-3xl">⬆️</span>
              <p className="text-sm text-[#F5F3EE]">Drag and drop a video file</p>
              <p className="text-xs text-[#8B8D98]">or click to browse</p>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoFile(e.target.files[0])}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Video file info */}
              <div className="flex items-center gap-3 bg-[#0B0B0F] rounded-lg px-3 py-2.5">
                <span className="text-xl">🎬</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{videoFile.name}</p>
                  <p className="text-xs text-[#8B8D98]">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                {!uploading && (
                  <button onClick={() => setVideoFile(null)} className="text-xs text-[#8B8D98] hover:text-[#F5F3EE] transition-colors">
                    Remove
                  </button>
                )}
              </div>

              {/* Thumbnail picker */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => !uploading && thumbInputRef.current?.click()}
                  className={`w-24 h-14 rounded-lg bg-[#0B0B0F] border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 transition-colors ${
                    uploading ? "border-white/10 opacity-50" : "border-white/15 hover:border-white/30 cursor-pointer"
                  }`}
                >
                  {thumbPreview ? (
                    <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-[#8B8D98] text-center px-1">Thumbnail</span>
                  )}
                </div>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleThumbFile(e.target.files[0])}
                />
                <p className="text-xs text-[#8B8D98]">
                  {thumbnail ? thumbnail.name : "Add a thumbnail image"}
                </p>
              </div>

              {uploading && (
                <div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#6C5CE7]"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-[#8B8D98] mt-1.5">
                    {done ? "Upload complete" : `Uploading... ${progress}%`}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                  placeholder="Title"
                  className="bg-[#0B0B0F] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] transition-colors disabled:opacity-50"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  placeholder="Description"
                  rows={3}
                  className="bg-[#0B0B0F] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={onClose}
                  disabled={uploading && !done}
                  className="px-4 py-2 rounded-full text-sm hover:bg-white/5 transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                {done ? (
                  <button onClick={onClose} className="px-4 py-2 rounded-full bg-[#6C5CE7] hover:bg-[#5b4bd6] text-sm font-medium transition-colors">
                    Done
                  </button>
                ) : (
                  <button
                    onClick={startUpload}
                    disabled={!title || !thumbnail || uploading}
                    className="px-4 py-2 rounded-full bg-[#6C5CE7] hover:bg-[#5b4bd6] text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Publish"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
