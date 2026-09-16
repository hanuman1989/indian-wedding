import axiosInstance from '../axios';

export async function getWeddingBooking(id) {
  try {
      const response =  await axiosInstance.get(`weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load booking. Please try again.' };
    }
}

export async function createWeddingBooking(weddingId, payload) {
  try {
      const response = await axiosInstance.post(`weddings/${weddingId}/bookings`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create booking. Please try again.' };
    }
}

const weddingBookingAPI = {
  getWeddingBooking,
  createWeddingBooking
};

export default weddingBookingAPI;
