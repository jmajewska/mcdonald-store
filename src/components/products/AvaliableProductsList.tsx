import React, { useEffect, useState, useContext, useCallback, ChangeEvent } from 'react';
import { productsService } from '../../services/productsService';
import { CategoriesModel, ProductModel } from '../../models/productsModel';
import { Product } from './Product';
import styles from './ProductsList.module.scss';
import { AuthContext } from '../../context/authContext';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getOrder } from '../../store/actions/cart-actions';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getCategories } from '../../store/actions/categories-actions';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Placeholder from '../../assets/no-results.jpg';

export const AvaliableProducts: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initCategory = params.get('category');
  const [products, setProducts] = useState<ProductModel[]>([]);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.state.isLoggedIn;
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector<RootState, CategoriesModel[]>((state) => state.categories);
  const [category, setCategory] = useState<string>(initCategory || '');
  const [searchInput, setSearchInput] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const getProductsData = useCallback(() => {
    productsService.getAllProducts(category, searchInput).then((res) => {
      setProducts(res);
    });
  }, [category, searchInput]);

  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    dispatch(getCategories());
    if (orderId) {
      dispatch(getOrder(orderId));
    }

    getProductsData();
  }, [category, getProductsData, searchInput]);

  const searchInputChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(ev.target.value);
    const searchParams = new URLSearchParams(search);
    searchParams.set('search', ev.target.value);
    const newSearch = '?' + searchParams.toString();
    const newLocation = { ...location, search: newSearch };
    navigate(newLocation.pathname + newSearch);
  };

  return (
    <>
      <div className='flex-wrapper-max'>
        <div className={styles.categories}>
          <NavLink to='/products' onClick={() => setCategory('')}>All</NavLink>
          {categories?.map((category, index) => {
            return <NavLink key={index} to={`/products?category=${category.name}`} onClick={() => setCategory(category.name)}>{category.name}</NavLink>;
          })}
        </div>
        <div className={styles.search}>
          <div className='flex'>
            <input
              onChange={searchInputChangeHandler}
              type="search"
              className="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <div className={styles.icon}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        </div>
        {products.length ? (
          <ul className={styles.productsList}>
            {products.map(product => {
              return <Product
                isButtonAvailable={isLoggedIn}
                product={product}
                key={product._id}
                updateProducts={getProductsData}
              />;
            }
            )}
          </ul>
        ) :
          <div className={styles.placeholder}>
            <h5>No results</h5>
            <img src={Placeholder} className={styles.img}></img>
          </div>
        }
      </div>
    </>
  );
};