import authAPI from './auth';
import adminUsersAPI from './admin/adminUsers';

const APIs = {
  auth: authAPI,
  frontend: {
  },
  admin: {
    users: adminUsersAPI,
  },
};

export default APIs;
