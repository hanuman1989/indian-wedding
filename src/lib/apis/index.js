import authAPI from './auth';
import adminUsersAPI from './admin/adminUsers';
import frontendAuthAPI from './frontendAuth';
import usersAPI from './users';
import weddingAPI from './wedding';

const APIs = {
  auth: authAPI,
  frontend: {
    auth: frontendAuthAPI,
    users: usersAPI,
    weddings: weddingAPI,
  },
  admin: {
    users: adminUsersAPI,
  },
};

export default APIs;
