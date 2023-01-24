// @ts-nocheck
import React, { useContext, useState } from 'react';
import styles from './Navbar.module.scss';
import { AuthContext } from '../../context/authContext';
import Burger from '../../assets/burger-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthStates } from '../../models/authModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { orderService } from '../../services/orderService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { CartState, initialState } from '../../store/reducers/cart-reducer';
import { Cart } from '../cart/Cart';
import { MenuContext } from '../../context/cartContext';
import { clearCart } from '../../store/reducers/cart-reducer';

interface Props {
  children?: React.ReactNode;
}

export const Navbar: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const cartState = useSelector<RootState>((state) => state.cart);
  const isOpened = useContext(MenuContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    dispatch(clearCart());
    localStorage.clear();
    authCtx.dispatch({ type: AuthStates.LOGOUT, payload: { user: '', isAdmin: false } });
    navigate('/');
  };
  return (
    <div className={styles.navWrapper}>
      <div className={styles.nav}>
        <img src={Burger} alt="burger logo" className={styles.logo} />
        <div className={styles.navActions}>
          {authCtx.state.isAdmin && <button onClick={() => navigate('/admin-panel')}>Admin Panel</button>}
          <button onClick={() => navigate('/products')}>Our offer</button>
          {authCtx.state.isLoggedIn &&
            <MenuContext.Provider value={isOpen}>
              <button className={styles.cartButton} onClick={() => setIsOpen(!isOpen)}>
                {!!cartState.productsCount && <span>{cartState.productsCount}</span>}
                <FontAwesomeIcon icon={faCartShopping} />
              </button>
              {isOpen && <Cart hide={() => setIsOpen(false)}></Cart>}
            </MenuContext.Provider>
          }
          {authCtx.state.isLoggedIn && <button onClick={logoutHandler}>Log out</button>}
          {!authCtx.state.isLoggedIn && <button onClick={() => navigate('/login')}>Log in</button>}
        </div>
      </div>
      {children}
    </div>
  );
};