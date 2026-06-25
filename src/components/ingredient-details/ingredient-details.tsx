import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  ingredientsSelector,
  loadingSelector
} from '../../services/slices/ingredientsSlice';
import { useParams, Params } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingredientsSelector);
  const loading = useSelector(loadingSelector);
  const { id } = useParams<Params>();

  const ingredientData = ingredients.find((i) => {
    if (i._id === id) return i;
  });

  if (!ingredientData || loading) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
