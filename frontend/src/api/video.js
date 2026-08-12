import api from "./axios";

/*
  Adjust these paths/response shapes to match YOUR backend's actual routes.
  These names follow the common pattern from typical video-backend clones,
  but check your own route file (e.g. video.routes.js) to confirm.
*/

// GET all videos (home feed)
export const getAllVideos = async ({ page = 1, limit = 12, query = "" } = {}) => {
  const res = await api.get("/videos", { params: { page, limit, query } });
  const payload = res.data?.data;
  return payload?.docs ?? payload?.videos ?? (Array.isArray(payload) ? payload : []);
};

// GET single video by id (watch page)
export const getVideoById = async (videoId) => {
  const res = await api.get(`/videos/${videoId}`);
  return res.data.data;
};

// POST toggle like on a video
export const toggleVideoLike = async (videoId) => {
  const res = await api.post(`/likes/toggle/v/${videoId}`);
  return res.data.data;
};

// GET videos belonging to a specific channel (for the channel/profile page)
export const getVideosByOwner = async (userId) => {
  const res = await api.get("/videos", { params: { userId } });
  const payload = res.data?.data;
  return payload?.docs ?? payload?.videos ?? (Array.isArray(payload) ? payload : []);
};

// POST toggle subscribe to a channel
export const toggleSubscribe = async (channelId) => {
  const res = await api.post(`/subscriptions/c/${channelId}`);
  return res.data.data;
};

// POST upload a new video (multipart: videoFile + thumbnail files, plus title/description)
// onProgress receives a 0-100 number, driven by the real upload — no more setInterval fake.
export const uploadVideo = async ({ videoFile, thumbnail, title, description }, onProgress) => {
  const formData = new FormData();
  formData.append("videoFile", videoFile);
  formData.append("thumbnail", thumbnail);
  formData.append("title", title);
  formData.append("description", description);

  const res = await api.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return res.data.data;
};
