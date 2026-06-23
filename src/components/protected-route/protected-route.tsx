import { Preloader } from '@ui';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import {
  authCheckedSelector,
  authenticatedSelector
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(authenticatedSelector);
  const isAuthChecked = useSelector(authCheckedSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return <Outlet />;
};
