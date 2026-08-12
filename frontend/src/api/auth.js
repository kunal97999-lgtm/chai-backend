import api from "./axios";

/*
  Adjust to match your backend's actual auth routes.
  Typical shape for a "chai aur code" style backend:
    POST /users/register  (multipart/form-data: avatar file required, coverImage optional)
    POST /users/login     (json: { email or username, password })
    POST /users/logout
    GET  /users/current-user
*/

export const registerUser = async (formData) => {
  // formData must be a FormData instance (see Signup.jsx) because of the file upload
  const res = await api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const loginUser = async ({ email, username, password }) => {
  const res = await api.post("/users/login", { email, username, password });
  return res.data.data; // typically { user, accessToken, refreshToken }
};

export const logoutUser = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/current-user");
  return res.data.data;
};