import authAPI from './auth';
import adminUsersAPI from './admin/adminUsers';
import frontUsersAPI from './admin/users';
import frontendAuthAPI from './frontendAuth';
import usersAPI from './users';
import frontWeddingAPI from './frontWeddings';
import weddingAPI from './weddings';
import weddingBookingAPI from './weddingBookingService'
import adminWeddingBookingAPI from './admin/adminWeddingBookingService'
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
    Adminusers: adminUsersAPI,
    users: frontUsersAPI,
    weddingBooking: adminWeddingBookingAPI,
  },
};

export default APIs;
