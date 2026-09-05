import axiosInstance from '../axios';
import { getFrontendToken } from '../helpers';

function authenticatedConfig(config = {}) {
  const token = getFrontendToken();

  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

function getError(error, fallback) {
  const data = error.response?.data;

  if (data && typeof data === 'object') {
    throw { ...data, status: error.response?.status };
  }

  throw { message: typeof data === 'string' ? data : fallback, status: error.response?.status };
}

const weddingAPI = {
  getWedding: async (id) => {
    try {
      const response = await axiosInstance.get(`/weddings/${id}`, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to load this wedding. Please try again.');
    }
  },

  createWedding: async (data) => {
    try {
      const response = await axiosInstance.post('/weddings', data, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to create your wedding draft. Please try again.');
    }
  },

  updateWeddingStepOne: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/weddings/${id}/step-1`, data, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to save your details. Please try again.');
    }
  },

  deleteWedding: async (id) => {
    try {
      const response = await axiosInstance.delete(`/weddings/${id}`, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to delete your wedding. Please try again.');
    }
  },

  getMyWeddings: async () => {
    try {
      const response = await axiosInstance.get('/my-weddings', authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to load your weddings. Please try again.');
    }
  },

  updatePartnerDetails: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/weddings/${id}/partner-details`, data, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to save partner details. Please try again.');
    }
  },

  updateStory: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/weddings/${id}/story`, data, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to save your story. Please try again.');
    }
  },

  updateWeddingDetails: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/weddings/${id}/details`, data, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to save wedding details. Please try again.');
    }
  },

  uploadWeddingPhotos: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images[]', file));

    try {
      const response = await axiosInstance.post(
        `/weddings/${id}/images`,
        formData,
        authenticatedConfig({ headers: { 'Content-Type': 'multipart/form-data' } })
      );
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to upload your photos. Please try again.');
    }
  },

  deleteWeddingPhoto: async (weddingId, photoId) => {
    try {
      const response = await axiosInstance.delete(`/weddings/${weddingId}/images/${photoId}`, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to remove this photo. Please try again.');
    }
  },

  reorderWeddingPhotos: async (weddingId, photos) => {
    try {
      const response = await axiosInstance.patch(`/weddings/${weddingId}/images/reorder`, { images: photos }, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to save the photo order. Please try again.');
    }
  },

  submitWedding: async (id) => {
    try {
      const response = await axiosInstance.post(`/weddings/${id}/submit`, {}, authenticatedConfig());
      return response.data;
    } catch (error) {
      return getError(error, 'Unable to publish your wedding. Please try again.');
    }
  },
};

export default weddingAPI;