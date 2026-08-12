import api from "./axios";

/*
  Adjust to match your backend's actual tweet routes.
  Typical shape:
    GET  /tweets/user/:userId   or   GET /tweets  (feed)
    POST /tweets                 { content }
    POST /likes/toggle/t/:tweetId
    DELETE /tweets/:tweetId
*/

export const getAllTweets = async () => {
  const res = await api.get("/tweets");
  const payload = res.data?.data;
  return payload?.docs ?? payload?.tweets ?? (Array.isArray(payload) ? payload : []);
};

export const getTweetsByUser = async (userId) => {
  const res = await api.get(`/tweets/user/${userId}`);
  const payload = res.data?.data;
  return payload?.docs ?? payload?.tweets ?? (Array.isArray(payload) ? payload : []);
};

export const createTweet = async (content) => {
  const res = await api.post("/tweets", { content });
  return res.data.data;
};

export const toggleTweetLike = async (tweetId) => {
  const res = await api.post(`/likes/toggle/t/${tweetId}`);
  return res.data.data;
};

export const deleteTweet = async (tweetId) => {
  const res = await api.delete(`/tweets/${tweetId}`);
  return res.data;
};