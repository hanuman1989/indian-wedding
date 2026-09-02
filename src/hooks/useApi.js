'use client';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    error,
    initialized,
  } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return result;
  };

  const logout = async () => {
    const result = await dispatch(logoutUser());
    if (result.type === logoutUser.fulfilled.type) {
      router.push('/login');
    }
    return result;
  };

  const isAdmin = () => role === 'admin';
  const isUser = () => role === 'user';
  const isModerator = () => role === 'moderator';

  return {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    isUser,
    isModerator,
    loading,
    error,
    initialized,
    login,
    logout,
  };
};
