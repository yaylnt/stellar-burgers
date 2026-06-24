import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser, loadingSelector } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(loadingSelector);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await dispatch(logoutUser());
      if (result.meta?.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut || loading) {
    return <Preloader />;
  }

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
