import axiosInstance from '../axios';

export async function getWedding(id) {
  try {
      const response =  await axiosInstance.get(`weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}

export async function getMyWeddings() {
  try {
      const response =  await axiosInstance.get('my-weddings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your weddings. Please try again.' };
    }
}

export async function createWedding(payload) {
  try {
      const response = await axiosInstance.post('/weddings', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}


export async function updateWedding(id, payload) {
  try {
      const response = await axiosInstance.patch(`weddings/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}

export async function updatePartnerDetails(id, payload) {
  try {
      const response = await axiosInstance.patch(`weddings/${id}/partner-details`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}

export async function updateStory(id, payload) {
  try {
      const response = await axiosInstance.patch(`weddings/${id}/story`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}

export async function updateWeddingDays(id, payload) {
  try {
      const response = await axiosInstance.patch(`weddings/${id}/details`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create wedding. Please try again.' };
    }
}

export async function uploadWeddingPhotos(id, photos) {
  const body = new FormData();
  photos.forEach((photo) => body.append("images[]", photo));
  try {
      const response = await axiosInstance.post(`weddings/${id}/images`, body);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'File Upload failed.' };
    }
}

export async function deleteWeddingPhoto(weddingId, imageId) {
  try {
      const response = await axiosInstance.delete(`weddings/${weddingId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to delete image. Please try again.' };
    }
}

export async function updatePhotoOrder(id, imageIds) {
  try {
      const response = await axiosInstance.patch(`weddings/${id}/images/reorder`, { image_ids: imageIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to update photo order. Please try again.' };
    }
}


export async function submitWedding(id) {
  try {
      const response = await axiosInstance.post(`weddings/${id}/submit`, {});
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to submit your wedding. Please try again.' };
    }
}

export async function deleteWedding(weddingId) {
  try {
      const response = await axiosInstance.delete(`weddings/${weddingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to delete wedding. Please try again.' };
    }
}

const weddingAPI = {
  getMyWeddings,
  getWedding,
  createWedding,
  updateWedding,
  updatePartnerDetails,
  updateStory,
  updateWeddingDays,
  uploadWeddingPhotos,
  updatePhotoOrder,
  deleteWeddingPhoto,
  submitWedding,
  deleteWedding
};

export default weddingAPI;
