import React from 'react';
import styles from './MainPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { orderService } from '../services/orderService';
import { AddProduct } from '../components/adminPanel/products/form/AddProduct';
import { useDispatch } from 'react-redux';
import { setOrderId, setWhereEat } from '../store/reducers/cart-reducer';
import { AppDispatch } from '../store/store';
import { Navigate, useNavigate } from 'react-router';

export const MainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isOrderStarted = localStorage.getItem('orderId');
  
  const inplaceHandler = () => {
    orderService.addToOrder({ inplace: true })
      .then(res => {
        dispatch(setWhereEat(true));
        dispatch(setOrderId(res.orderId));
        localStorage.setItem('orderId', res.orderId);
        navigate('/products');
      })
      .catch(err => console.log(err));
  };

  const takewayHandler = () => {
    orderService.addToOrder({ inplace: false })
      .then(res => {
        dispatch(setWhereEat(false));
        dispatch(setOrderId(res.orderId));
        navigate('/products');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='flex-wrapper-max h-screen'>
      {!isOrderStarted &&
        <div className={styles.cardWrapper}>
          <button className={styles.card} onClick={inplaceHandler}>
            <FontAwesomeIcon icon={faUtensils} className={styles.icon} ></FontAwesomeIcon>
            <p>In place</p>
          </button>
          <button className={styles.card}>
            <FontAwesomeIcon icon={faHouseUser} className={styles.icon} onClick={takewayHandler} ></FontAwesomeIcon>
            <p>Takeaway</p>
          </button>
        </div>
      }
      {isOrderStarted && <Navigate to='/products'/>}
    </div>
  );
};