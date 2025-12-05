import api from "../lib/api";

export const fetchPosts = (q = {}) =>
  api.get("/posts", {
    params: { page: q.page || 1, limit: q.limit || 10, ...q },
  });

export const createPostJSON = (payload) => api.post("/posts", payload);
export const createPostMultipart = (formData) => api.post("/posts", formData);
export const deletePost = (id) => api.delete(`/posts/delete/${id}`);

export const toggleLikePost = (id) => api.post(`/posts/${id}/like`);

export const listComments = (postId, parent = null, page = 1, limit = 20) =>
  api.get(`/posts/${postId}/comments`, { params: { parent, page, limit } });
export const addComment = (postId, body, parentId) =>
  api.post(
    `/posts/${postId}/comments`,
    parentId ? { body, parentId } : { body }
  );
export const updateComment = (id, body) =>
  api.patch(`/comments/${id}`, { body });
export const deleteComment = (id) => api.delete(`/comments/${id}`);

// ✅ Add this in services/posts.js
export function toggleLikeComment(commentId) {
  return api.post(`/comments/${commentId}/like-toggle`);
}
