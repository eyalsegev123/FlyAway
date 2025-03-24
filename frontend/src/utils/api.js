// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Create a base axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API request functions
export const apiService = {
  // User Routes (matching userController.js)
  login: (credentials, options = {}) =>
    apiClient.post("/api/usersRoutes/login", credentials, options),

  register: (userData, options = {}) =>
    apiClient.post("/api/usersRoutes/register", userData, options),

  getUserProfile: (userId, options = {}) =>
    apiClient.get(`/api/usersRoutes/user_profile/${userId}`, options),

  updateUser: (userId, userData, options = {}) =>
    apiClient.put(`/api/usersRoutes/update/${userId}`, userData, options),

  // Wishes Routes (matching wishController.js)
  getUserWishes: (userId, options = {}) =>
    apiClient.get(`/api/wishesRoutes/getUserWishes/${userId}`, options),

  addToWishlist: (wishData, options = {}) =>
    apiClient.post("/api/wishesRoutes/addToWishList", wishData, options),

  deleteWish: (wishId, options = {}) =>
    apiClient.delete(`/api/wishesRoutes/deleteWish/${wishId}`, options),

  editWish: (wishId, wishData, options = {}) =>
    apiClient.post(`/api/wishesRoutes/editWish/${wishId}`, wishData, options),

  // Trip Routes (matching tripController.js)
  getTrips: (userId, options = {}) =>
    apiClient.get(`/api/tripsRoutes/getUserTrips/${userId}`, options),

  addTrip: (userId, tripData, options = {}) =>
    apiClient.post(`/api/tripsRoutes/addTrip/${userId}`, tripData, options),

  deleteTrip: (tripId, options = {}) =>
    apiClient.delete(`/api/tripsRoutes/deleteTrip/${tripId}`, options),

  editTrip: (tripId, tripData, options = {}) =>
    apiClient.post(`/api/tripsRoutes/editTrip/${tripId}`, tripData, options),

  fetchAlbum: (tripId, options = {}) =>
    apiClient.get(`/api/tripsRoutes/fetchAlbum/${tripId}`, options),

  // OpenAI Routes (matching openAiController.js)
  planTrip: (tripData, options = {}) =>
    apiClient.post("/api/openAiRoutes/planTrip", tripData, options),

  improveTripRecommendation: (threadId, message, options = {}) =>
    apiClient.post(
      `/api/openAiRoutes/improveRecommendation/${threadId}`,
      { message },
      options
    ),

  cancelRequest: (threadId, options = {}) =>
    apiClient.delete(`/api/openAiRoutes/cancelRequest/${threadId}`, options),

  deleteThread: (threadId, options = {}) =>
    apiClient.delete(`/api/openAiRoutes/deleteThread/${threadId}`, options),
};

export default apiService;
