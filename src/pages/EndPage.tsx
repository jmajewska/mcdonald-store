import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styles from './EndPage.module.scss';

export const EndPage = () => {
  const { id } = useParams();

  return (
    <div className={styles.wrapper}>
      <div className={styles.orderCard}>
        <h5>Your order number:</h5>
        <h1>{id}</h1>
      </div>

      <div className={styles.actions}>
        <button>Log out</button>
        <button>
          <Link to='/'>Start new order</Link>
        </button>
      </div>
    </div>
  );
};