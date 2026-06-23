import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  constructorItemsSelector,
  orderDataSelector,
  orderRequestSelector,
  orderBurger,
  sendOrderRequest,
  clearOrderModal
} from '../../services/slices/orderSlice';
import { authenticatedSelector } from '../../services/slices/userSlice';
import { getFeed } from '../../services/slices/feedSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderDataSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(authenticatedSelector);

  const ingredients = constructorItems.ingredients.map((i) => i._id);
  const bun = constructorItems.bun?._id;
  let burger: string[];

  if (bun) {
    burger = [bun, ...ingredients, bun];
  }

  const onOrderClick = () => {
    if (isAuth && constructorItems.bun) {
      dispatch(sendOrderRequest());
      dispatch(orderBurger(burger));
      dispatch(getFeed());
    } else if (isAuth && !constructorItems.bun) {
      return;
    } else if (!isAuth) {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
