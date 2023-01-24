import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'react-bootstrap';
import { ErrorMessage } from "../../../../shared/errorMessage/ErrorMessage";
import { orderService } from "../../../../services/orderService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCategories } from "../../../../store/actions/categories-actions";
import { AppDispatch } from "../../../../store/store";
import { toast } from 'react-toastify';

const categoryShape = yup.object().shape({
  name: yup
    .string()
    .required('This field is required')
});

interface Props {
  hide: () => void;
}

export const AddCategory:React.FC<Props> = ({hide}) => {
  const [backendError, setBackendError] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const { handleSubmit, formState: { errors }, register } = useForm({
    resolver: yupResolver(categoryShape),
    defaultValues: {
      name: ''
    }
  });
  useEffect(() => {

  });
  const addCategoryHandler = handleSubmit((values) => {
    orderService.addCategory(values)
      .then(() => {
        toast.success('Category added!')
        dispatch(getCategories());
        hide()
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setBackendError(err.response.data.errors.category);
        }
      });
  });

  return (
    <Form className="form " onSubmit={addCategoryHandler}>
      <Form.Group className="form-row flex justify-between">
        <Form.Label>name</Form.Label>
        <Form.Control {...register('name')} type="text" placeholder="category name" onChange={() => setBackendError('')} />
      </Form.Group>
      {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      {backendError && <ErrorMessage>{backendError}</ErrorMessage>}
      <Form.Group>
        <button>Add category</button>
      </Form.Group>
    </Form>
  );
};