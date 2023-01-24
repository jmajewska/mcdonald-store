// @ts-nocheck
import { Card } from "../card/Card"
import { CustomModal } from "../../../shared/modal/Modal"
import styles from './ProductsPanel.module.scss';
import { useState } from "react";
import { AddProduct } from "./form/AddProduct";

export const ProductsPanel:React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  return <Card>
    <div>
      <div className={styles.header}>
        <h5>Products</h5>
        <button onClick={()=>setIsModalOpened(!isModalOpened)}>Add new product</button>
      </div>
      <div>

      </div>
    </div>
    <CustomModal show={isModalOpened} onHide={()=>setIsModalOpened(!isModalOpened)}><AddProduct></AddProduct></CustomModal>
  </Card>
}