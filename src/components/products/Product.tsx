// @ts-nocheck
import React, { useState, useContext } from 'react';
import { ProductModel } from '../../models/productsModel';
import styles from './Product.module.scss';
import ProductPlaceholder from '../../assets/product-placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CustomModal } from '../../shared/modal/Modal';
import { CustomizeProduct } from './CustomizeProduct';
import { AuthContext } from '../../context/authContext';
import { EditProduct } from './EditProduct';
import { productsService } from '../../services/productsService';
import { toast } from 'react-toastify';

interface Props {
  product: ProductModel;
  isButtonAvailable: boolean;
  updateProducts: () => void;
};

export const Product: React.FC<Props> = ({ product, isButtonAvailable, updateProducts }) => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState<boolean>(false);
  const [isDeletteProductOpen, setIsDeleteProductOpen] = useState<boolean>(false);
  const isAdmin = useContext(AuthContext).state.isAdmin;

  const hideModal = () => {
    setIsModalOpened(false);
  };

  const deleteProductHandler = () => {
    productsService.deleteProduct(product._id)
      .then((res) => {
        toast.success('Product deleted')
        updateProducts();
        hideModal();
      });
  };

  const hideEditModal = () => {
    setIsEditModalOpened(false)
  }

  return (
    <li className={styles.product}>
      <img src={product?.picture === 'undefined' || !product.picture ? ProductPlaceholder : `http://localhost:3000/${product.picture}`} alt="placeholder" className={styles.productImage} />
      <div className={styles.productInfo}>
        <div>
          <p>{product.name}</p>
          <span>{product.category_type}</span>
        </div>
        <div className={styles.price}>
          {product.default_price.$numberDecimal} $
        </div>
      </div>
      {isButtonAvailable &&
        <button
          onClick={() => setIsModalOpened(true)}
          className={styles.btn}
        >
          <FontAwesomeIcon icon={faCartPlus} />
        </button>}
      {isAdmin &&
        <>
          <button
            onClick={() => setIsEditModalOpened(true)}
            className={styles.adminBtn}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            onClick={() => setIsDeleteProductOpen(true)}
            className={styles.deleteBtn}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      }
      <CustomModal
        onHide={() => setIsDeleteProductOpen(false)}
        show={isDeletteProductOpen}
      >
        <div className={styles.modalWrapper}>
          <h5>Are you sure you wan to delete:</h5>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.actions}>
            <button
              onClick={() => setIsDeleteProductOpen(false)}
              className={styles.deleteBtn}
            >
              Cancel
            </button>
            <button
            className={styles.submitBtn}
              onClick={() => deleteProductHandler()}
            >
              Delete
            </button>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        show={isEditModalOpened}
        onHide={() => setIsEditModalOpened(false)}>
        <EditProduct
          product={product}
          updateProducts={updateProducts}
          hideModal={hideEditModal}
        />
      </CustomModal>
      <CustomModal
        show={isModalOpened}
        onHide={() => setIsModalOpened(false)}
      >
        <CustomizeProduct
          product={product}
          hideModal={hideModal}
        />
      </CustomModal>
    </li>
  );

};