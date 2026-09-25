import axiosInstance from '../axios';

export async function getBooking(id) {
  try {
      const response =  await axiosInstance.get(`wedding-bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to fetch the booking. Please try again.' };
    }
}

export async function getMyBookings(params) {
  try {
      const response =  await axiosInstance.get('wedding-bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your weddings. Please try again.' };
    }
}

export async function getMyBookingStats(params) {
  try {
      const response =  await axiosInstance.get('wedding-bookings/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your booking stats. Please try again.' };
    }
}

export async function downloadInvitationCard(bookingId) {
  try {
      const response =  await axiosInstance.get(`bookings/${bookingId}/invitation/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw await parseBlobError(error, 'Unable to download the invitation card. Please try again.');
    }
}

// The download endpoint returns a raw PDF, so error responses arrive as a Blob instead of JSON.
async function parseBlobError(error, fallbackMessage) {
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      return JSON.parse(await data.text());
    } catch {
      return { message: fallbackMessage };
    }
  }
  return data || { message: fallbackMessage };
}



const myBookingsAPI = {
  getBooking,
  getMyBookings,
  getMyBookingStats,
  downloadInvitationCard
};

export default myBookingsAPI;
