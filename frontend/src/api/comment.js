import api from "./axios";

// GET comments for a video
export const getComments = async (videoId) => {
  const res = await api.get(`/comments/v/${videoId}`);
  const payload = res.data?.data;
  return payload?.docs ?? payload?.comments ?? (Array.isArray(payload) ? payload : []);
};

// POST a new comment
export const addComment = async (videoId, content) => {
  const res = await api.post(`/comments/v/${videoId}`, { content });
  return res.data.data;
};
