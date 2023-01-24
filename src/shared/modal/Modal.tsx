import Modal from 'react-bootstrap/Modal';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onHide: () => void;
}

export const CustomModal: React.FC<Props> = ({ children, show, onHide }) => {
  return <Modal show={show} onHide={onHide}>
    <Modal.Header>
      <button onClick={onHide}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
  </Modal>;
};