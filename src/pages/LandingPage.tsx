import React from 'react';
import Burger from '../assets/burger-logo.png';
import styles from './LandingPage.module.scss';
import { Link } from 'react-router-dom';


export const LandingPage = () => {
  return (
    <div className='flex-wrapper-max'>
      <div className={styles.entryWrapper}>
        <img src={Burger} alt="burger logo" className={styles.logo} />
        <div className={styles.slogan}>
          Make your day better with burger.
        </div>
        <div className={styles.actions}>
          <Link to='/login'>Log in to make an order</Link>
          <Link to='/products' >See the offer</Link>
        </div>
      </div>
    </div>);
};