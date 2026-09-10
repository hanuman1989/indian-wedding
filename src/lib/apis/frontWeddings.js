import axiosInstance from '../axios';

export async function getWeddings(params) {
  try {
      const response =  await axiosInstance.get(`weddings`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Unable to create your account. Please try again.' };
    }
}


const frontWeddingAPI = {
  getWeddings,
};

export default frontWeddingAPI;
