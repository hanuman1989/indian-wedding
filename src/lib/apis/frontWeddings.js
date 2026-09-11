import axiosInstance from '../axios';

export async function getWeddings(params) {
  try {
      const response =  await axiosInstance.get(`wedding-list`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}

export async function getPopularWeddings() {
  try {
      const response =  await axiosInstance.get(`popular-weddings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}


const frontWeddingAPI = {
  getWeddings,
  getPopularWeddings
};

export default frontWeddingAPI;
