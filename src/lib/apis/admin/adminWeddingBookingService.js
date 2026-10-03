import axiosInstance from '../../axios';

export async function getWeddingDetail(id) {
  try {
      const response =  await axiosInstance.get(`admin/weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load wedding. Please try again.' };
    }
}

export async function getWeddings(params) {
  try {
      const response =  await axiosInstance.get('admin/weddings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your weddings. Please try again.' };
    }
}

export async function getMyBookingStats(params) {
  try {
      const response =  await axiosInstance.get('admin/wedding-bookings/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your booking stats. Please try again.' };
    }
}


export async function getBookings(params) {
  try {
      const response =  await axiosInstance.get('admin/bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load your bookings. Please try again.' };
    }
}

export async function exportWeddingToExcel(params) {
  try {
      const response =  await axiosInstance.get(`admin/weddings/export`, {
        params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw await parseBlobError(error, 'Unable to download the invitation card. Please try again.');
    }
}

export async function bookingDetail(id) {
  try {
      const response =  await axiosInstance.get(`admin/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to load booking. Please try again.' };
    }
}

export async function deleteWedding(weddingId) {
  try {
      const response = await axiosInstance.delete(`admin/weddings/${weddingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to delete wedding. Please try again.' };
    }
}

export async function downloadInvitationCard(bookingId) {
  try {
      const response =  await axiosInstance.get(`admin/bookings/${bookingId}/invitation/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw await parseBlobError(error, 'Unable to download the invitation card. Please try again.');
    }
}

export async function exportBookingToExcel(params) {
  try {
      const response =  await axiosInstance.get(`admin/bookings/export`, {
        params,
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw await parseBlobError(error, 'Unable to download the booking export file. Please try again.');
    }
}


const adminWeddingBookingAPI = {
  getWeddingDetail,
  getMyBookingStats,
  getWeddings,
  getBookings,
  bookingDetail,
  exportWeddingToExcel,
  exportBookingToExcel,
  deleteWedding,
  downloadInvitationCard
};

export default adminWeddingBookingAPI;
