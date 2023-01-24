// @ts-nocheck
import { CustomModal } from "../../shared/modal/Modal";

interface Props {
  productName:string;
  onCancel: () => void;
  onSubmit: () => void;
};

export const DeleteModal:React.FC<Props> = ({productName, onCancel, onSubmit}) => {
  return <CustomModal onHide={onCancel}>
  <div>
    <div>Are you sure you wan to delete</div>
    <div>{productName}</div>
    <div>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onSubmit}>Delete</button>
    </div>
  </div>
  </CustomModal>
}