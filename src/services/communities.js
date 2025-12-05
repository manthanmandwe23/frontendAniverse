// src/services/communities.js
import api from "../lib/api";

// LIST
export const getAllCommunities = (params = {}) =>
  api.get("/communities", { params });

// SINGLE
export const getCommunity = (id) => api.get(`/communities/${id}`);

// JOIN / LEAVE
export const joinCommunity = (id) => api.patch(`/communities/${id}/join`);
export const leaveCommunity = (id) => api.patch(`/communities/${id}/leave`);

// MESSAGE HISTORY
export const listMessages = (communityId, params = {}) =>
  api.get(`/communities/${communityId}/messages`, { params });
