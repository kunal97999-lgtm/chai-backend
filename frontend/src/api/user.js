import api from "./axios";

/*
  Typical route: GET /users/c/:username
  Returns channel-level aggregated data: subscribersCount, isSubscribed,
  fullname, avatar, coverImage, etc. Adjust path/fields to your backend.
*/
export const getChannelProfile = async (username) => {
  const res = await api.get(`/users/c/${username}`);
  return res.data.data;
};