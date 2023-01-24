// @ts-nocheck
import { useEffect, useReducer, useState, useRef } from "react";
import { ProductModel } from "../../models/productsModel";
import styles from './CustomizeProduct.module.scss';
import ProductPlaceholder from '../../assets/product-placeholder.png';
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IngredientsModel } from "../../models/productsModel";
import { orderService } from "../../services/orderService";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getOrder } from "../../store/actions/cart-actions";

interface IngredientActions {
  type: 'ADD' | 'SUBSTRACT' | 'SET_INGREDIENTS';
  payload: any;
};

const ingredientReducer = (state: IngredientsModel[], action: IngredientActions) => {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return [...action.payload];
    case 'ADD':
      const ingredientToUpdate = state[action.payload];
      const newState = state.map((val, index) => index === action.payload ? { ...ingredientToUpdate, count: ingredientToUpdate.count + 1 } : val);
      return newState;
    case 'SUBSTRACT':
      const ingredientToUpdate2 = state[action.payload];
      const newState2 = state.map((val, index) => index === action.payload ? { ...ingredientToUpdate2, count: ingredientToUpdate2.count - 1 } : val);
      return newState2;
    default:
      return state;
  }
};

interface Props {
  product: ProductModel;
  hideModal: () => void;
}

export const CustomizeProduct: React.FC<Props> = ({ product, hideModal }) => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, product.ingredients);
  const orderId = useSelector<RootState, number>((state) => state.cart.cart._id);
  const storeDispatch = useDispatch<AppDispatch>();
  const amount = useRef(+product.default_price.$numberDecimal)

  useEffect(() => {
    dispatch({ type: 'SET_INGREDIENTS', payload: product.ingredients });
  }, []);
  

  const addExtraHandler = (index: number, price: any) => {
    dispatch({ type: 'ADD', payload: index });
    amount.current += +price;
  };

  const substractExtraHandler = (index: number, price:any) => {
    dispatch({ type: 'SUBSTRACT', payload: index });
    amount.current -= +price
  };

  const addProductHandler = () => {
    const updatedProduct = { ...product, ingredients };
    orderService.addToOrder(updatedProduct, orderId)
      .then(res => {
        storeDispatch(getOrder(res._id));
        hideModal()
      })
      .catch(err => console.log(err));
  };

  return <div className="flex flex-col items-center w-full">
    {product && <div className={styles.productInfoWrapper}>
      <div className={styles.productInfo}>
        <img src={product?.picture === 'undefined' || !product.picture ? ProductPlaceholder : `http://localhost:3000/${product.picture}`} alt="product picture" />
        <div>
          <h4>{product.name}</h4>
          <h5>{product.category_type}</h5>
        </div>
      </div>
      <div className={styles.ingredientsWrapper}>
        {product && product.ingredients &&
          ingredients.map((ingredient, index) => {
            return <div className={styles.ingredient} key={index}>
              <div>
                {ingredient.name}
              </div>
              <div className={styles.count}>{ingredient.count}</div>
              <div className={styles.buttons}>
                {ingredient.count > 0 && <button onClick={() => substractExtraHandler(index, ingredient.price.$numberDecimal)}>
                  <FontAwesomeIcon icon={faSubtract} />
                </button>}
                {<button onClick={() => addExtraHandler(index, ingredient.price.$numberDecimal)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>}
              </div>
              <div>{ingredient.price.$numberDecimal} $/ each extra</div>
            </div>;
          })
        }
      </div>
      <button className={styles.addButton} onClick={() => addProductHandler()}>Add for <span>{amount.current}$</span></button>
    </div>}
  </div>
    ;
};