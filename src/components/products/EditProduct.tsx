// @ts-nocheck
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductModel } from '../../models/productsModel';
import { productsService } from '../../services/productsService';
import { ErrorMessage } from '../../shared/errorMessage/ErrorMessage';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface Props {
  product: ProductModel;
  updateProducts: () => void;
  hideModal: () => void;
};

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name of product is required'),
  default_price: yup
    .string()
    .required('Price of a product is required'),
  ingredients: yup
    .array()
    .nullable()
    .of(
      yup
        .object()
        .shape({
          name: yup
            .string()
            .required('Name of ingredient is required'),
          count: yup
            .number()
            .required('Count is required')
            .min(1, 'Count must be at least 1'),
          price: yup
            .number()
            .required("Ingredient's count is required")
            .min(0.01, 'Price must be at least 0.01'),
        })
    )
});
export const EditProduct: React.FC<Props> = ({ product, updateProducts, hideModal }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<ProductModel>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      ingredients: []
    }
  });

  const submitEditHandler = handleSubmit((values) => {
    productsService.updateProduct(product._id, values)
      .then((res) => {
        updateProducts();
        toast.success('Product edited!');
        hideModal();
      })
      .catch((err) => console.log(err));
  });

  const { fields } = useFieldArray({
    control,
    name: 'ingredients'
  });

  return <div>
    <Form onSubmit={submitEditHandler} className='form'>
      <Form.Group className='form-row'>
        <Form.Label htmlFor="name">name</Form.Label>
        <Form.Control type="text" defaultValue={product.name} {...register('name')} />
      </Form.Group>
      {errors.name && <ErrorMessage>{`${errors.name.message}`}</ErrorMessage>}
      <Form.Group className='form-row'>
        <Form.Label htmlFor="price">price</Form.Label>
        <Form.Control type="text" defaultValue={product.default_price.$numberDecimal} {...register('default_price')} />
      </Form.Group>
      {errors.default_price && <ErrorMessage>{`${errors.default_price.message}`}</ErrorMessage>}
      <Form.Group className='flex'>
        <Form.Label htmlFor="flexCheckDefault" className='mr-12'>
          is vege
        </Form.Label>
        <Form.Check defaultChecked={product.isVege} type="checkbox" {...register('isVege')} />
      </Form.Group>
      <Form.Group>
        {product.ingredients.map((field, index) => {
          return (
            <Form.Group key={index} className='form-row-3' >
              <Form.Group >
                <Form.Label htmlFor="">ingredient name</Form.Label>
                <Form.Group>
                  <Form.Control defaultValue={field.name} type="text" {...register(`ingredients.${index}.name`)} />
                  {errors?.ingredients && errors.ingredients[index]?.name && <ErrorMessage>{`${errors.ingredients[index]?.name?.message}`}</ErrorMessage>}
                </Form.Group>
              </Form.Group>
              <Form.Group >
                <Form.Label htmlFor="">price</Form.Label>
                <Form.Group>
                  <Form.Control defaultValue={field.price.$numberDecimal} type="number" {...register(`ingredients.${index}.price`)} />
                  {errors?.ingredients && errors.ingredients[index]?.price && <ErrorMessage>{`${errors.ingredients[index]?.price?.message}`}</ErrorMessage>}
                </Form.Group>
              </Form.Group>
              <Form.Group >
                <Form.Label htmlFor="">count</Form.Label>
                <Form.Group>
                  <Form.Control defaultValue={field.count} type="number" {...register(`ingredients.${index}.count`)} />
                  {errors?.ingredients && errors.ingredients[index]?.count && <ErrorMessage>{`${errors.ingredients[index]?.count?.message}`}</ErrorMessage>}
                </Form.Group>
              </Form.Group>
            </Form.Group>
          );
        })}
      </Form.Group>
      <Form.Group>
        <button type='submit'>Edit product</button>
      </Form.Group>
    </Form>
  </div>;
};