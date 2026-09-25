import authAPI from './auth';
import adminUsersAPI from './admin/adminUsers';
import frontendAuthAPI from './frontendAuth';
import usersAPI from './users';
import frontWeddingAPI from './frontWeddings';
import weddingAPI from './weddings';
import weddingBookingAPI from './weddingBookingService'
import contactInquiryAPI from './contactInquiry';
import myBookingsAPI from './myBookings';

const APIs = {
  auth: authAPI,
  frontend: {
    auth: frontendAuthAPI,
    users: usersAPI,
    weddings: weddingAPI,
    frontWeddings: frontWeddingAPI,
    weddingBooking: weddingBookingAPI,
    contactInquiry: contactInquiryAPI
  },
  account:{
    myBookings: myBookingsAPI,
  },
  admin: {
    users: adminUsersAPI,
  },
};

export default APIs;
