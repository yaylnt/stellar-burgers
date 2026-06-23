import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  viewOrderSelector,
  orderRequestSelector,
  getOrderByNumber
} from '../../services/slices/feedSlice';
import { ingredientsSelector } from '../../services/slices/ingredientsSlice';
import { useParams, Params } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const number = Number(useParams<Params>().number);
  const orderData = useSelector(viewOrderSelector);
  const dispatch = useDispatch();
  const isRequest = useSelector(orderRequestSelector);

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  useEffect(() => {
    if (orderData && orderData.number === number) return;
    dispatch(getOrderByNumber(number));
  }, [dispatch, number, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isRequest) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
