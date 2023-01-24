import styles from './ErrorMessage.module.scss';

interface Props {
  children: React.ReactNode;
}

export const ErrorMessage: React.FC<Props> = ({ children }) => {
  return <div className={styles.errorMessage}>{children}</div>;
};


