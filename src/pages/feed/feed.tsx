import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  feedSelector,
  getFeed,
  isLoadingSelector
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const { orders } = useSelector(feedSelector);
  const dispatch = useDispatch();
  const loading = useSelector(isLoadingSelector);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(getFeed());
        }}
      />
    </>
  );
};
