// @ts-nocheck
import styles from './Cart.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearCart, initialState } from '../../store/reducers/cart-reducer';
import ProductPlaceholder from '../../assets/product-placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { CustomModal } from '../../shared/modal/Modal';
import { orderService } from '../../services/orderService';
import { AppDispatch } from '../../store/store';
import { deleteProductFromOrder } from '../../store/actions/cart-actions';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
  hide: () => void;
}

export const Cart: React.FC<Props> = ({ hide }) => {
  const cart = useSelector<RootState, initialState>((state) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const deleteProductHandler = (index: number) => {
    dispatch(deleteProductFromOrder({ cart: cart, index }));
  };

  const orderHandler = () => {
    orderService.confirmOrder(cart.cart._id, cart)
      .then(res => {
        toast.success('Your order was sent')
        navigate(`/next-order/${res.orderNumber}`)
        dispatch(clearCart());
        localStorage.removeItem('orderId');
        hide();
      })
      .catch((err) => console.log(err));
  };

  return <div className={styles.cartContainer}>
    {cart.cart.products.length === 0 && <div>No products in your cart</div>}
    {cart.cart.products &&
      <div className={styles.scrollable}>
        {cart.cart.products.map((product, index) => {
          const totalForProduct = +product.default_price.$numberDecimal + product
            .ingredients
            .reduce((acc, curr) => {
              if (curr.count > 1) {
                return acc + +(curr.count - 1) * +curr.price.$numberDecimal;
              }
              return +acc;
            }, 0);
          return <li key={index}>
            <img src={product?.picture === 'undefined' || !product.picture ? ProductPlaceholder : `http://localhost:3000/${product.picture}`} alt="product picture" />
            <div>{product.name}</div>
            <div>{totalForProduct} $</div>
            <button className={styles.delete} onClick={() => deleteProductHandler(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>;
        })}
      </div>
    }
    <div className={styles.footer}>
      <div className={styles.total}>Total: {cart.amount}$</div>
      {cart.cart.products.length > 0 && <button onClick={() => orderHandler()} className={styles.order}>Order</button>}
    </div>
  </div>;
};