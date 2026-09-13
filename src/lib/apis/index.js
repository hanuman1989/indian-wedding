import authAPI from './auth';
import adminUsersAPI from './admin/adminUsers';
import frontendAuthAPI from './frontendAuth';
import usersAPI from './users';
import frontWeddingAPI from './frontWeddings';
import weddingAPI from './weddings';

const APIs = {
  auth: authAPI,
  frontend: {
    auth: frontendAuthAPI,
    users: usersAPI,
    weddings: weddingAPI,
    frontWeddings: frontWeddingAPI,
  },
  admin: {
    users: adminUsersAPI,
  },
};

export default APIs;
