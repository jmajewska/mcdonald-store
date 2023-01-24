import { useEffect, useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductModel } from '../../../../models/productsModel';
import { CategoriesModel } from '../../../../models/productsModel';
import { orderService } from '../../../../services/orderService';
import { productsService } from '../../../../services/productsService';
import { Form } from 'react-bootstrap';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage } from '../../../../shared/errorMessage/ErrorMessage';
import { toast } from 'react-toastify';

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name of product is required'),
  category_type: yup
    .string()
    .required('Category of a product is required'),
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

interface Props {
  hide: () => void;
}

export const AddProduct:React.FC<Props> = ({hide}) => {
  const [categories, setCategories] = useState<CategoriesModel[]>();
  const [backendError, setBackendError] = useState<any>({})
  const { register, handleSubmit, formState: { errors }, control } = useForm<ProductModel>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      ingredients: []
    }
  });

  const { fields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  });

  useEffect(() => {
    orderService.getCategories().then((res) => {
      setCategories(res.data);
    });
  }, []);

  const addProductHandler = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'picture') {
        formData.append(key, value[0]);
      } else if (key === 'ingredients') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    productsService.postNewProduct(formData).then(res => {
      toast.success('Product added!')
      hide()
    })
    .catch((err) => setBackendError({name: err.response.data.errors.name}));
  });

  return (
    <div>
      <Form onSubmit={addProductHandler} encType="multipart/form-data" className='form'>
        <Form.Group className='form-row'>
          <Form.Label htmlFor="name">name</Form.Label>
          <Form.Control type="text" {...register('name')} />
        </Form.Group>
        {backendError.name && <ErrorMessage>{backendError.name}</ErrorMessage>}
        {errors.name && <ErrorMessage>{`${errors.name.message}`}</ErrorMessage>}
        <Form.Group className='form-row'>
          <Form.Label htmlFor="price">price</Form.Label>
          <Form.Control type="text" {...register('default_price')} />
        </Form.Group>
        {errors.default_price && <ErrorMessage>{`${errors.default_price.message}`}</ErrorMessage>}
        <Form.Group className='form-row'>
          <Form.Label>category</Form.Label>
          <Controller
            control={control}
            name='category_type'
            render={({ field: { onChange } }) => (
              <AsyncCreatableSelect
                styles={{
                  container: (base) => ({
                    ...base,
                    width: '60%'
                  })
                }}
                cacheOptions
                placeholder='Select category'
                getOptionValue={(option) => option.label}
                getOptionLabel={(option) => option.label}
                defaultOptions={categories?.map((category) => {
                  return {
                    value: category.name,
                    label: category.name,
                  };
                })}
                onChange={(data) => {
                  onChange(data?.value);
                }}
              />
            )}
          />
        </Form.Group>
        {errors.category_type && <ErrorMessage>{`${errors.category_type.message}`}</ErrorMessage>}
        <Form.Group className='form-row'>
          <Form.Label htmlFor="picure">picture*</Form.Label>
          <Form.Control type="file" {...register('picture')} />
        </Form.Group>
        <Form.Group className='flex'>
          <Form.Label htmlFor="flexCheckDefault" className='mr-12'>
            is vege
          </Form.Label>
          <Form.Check type="checkbox" {...register('isVege')} />
        </Form.Group>
        <Form.Group>
          <Form.Group className=''>
            <Form.Label className='mr-3 items-center'>ingredients*</Form.Label>
          </Form.Group>
          {fields.map((field, index) => {
            return (
              <Form.Group key={field.id} className='form-row-3' >
                <Form.Group >
                  <Form.Label htmlFor="">ingredient name</Form.Label>
                  <Form.Group>
                    <Form.Control type="text" {...register(`ingredients.${index}.name`)} />
                    {errors?.ingredients && errors.ingredients[index]?.name && <ErrorMessage>{`${errors.ingredients[index]?.name?.message}`}</ErrorMessage>}
                  </Form.Group>
                </Form.Group>
                <Form.Group >
                  <Form.Label htmlFor="">price</Form.Label>
                  <Form.Group>
                    <Form.Control type="number" {...register(`ingredients.${index}.price`)} />
                    {errors?.ingredients && errors.ingredients[index]?.price && <ErrorMessage>{`${errors.ingredients[index]?.price?.message}`}</ErrorMessage>}
                  </Form.Group>
                </Form.Group>
                <Form.Group >
                  <Form.Label htmlFor="">count</Form.Label>
                  <Form.Group>
                    <Form.Control type="number" {...register(`ingredients.${index}.count`)} />
                    {errors?.ingredients && errors.ingredients[index]?.count && <ErrorMessage>{`${errors.ingredients[index]?.count?.message}`}</ErrorMessage>}
                  </Form.Group>
                </Form.Group>
                <button onClick={() => removeIngredient(index)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </Form.Group>
            );
          })}
          <button type='button' onClick={() => addIngredient({ name: '', price: 0, count: 1 })}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </Form.Group>
        <Form.Group>
          <button type='submit'>Add product</button>
        </Form.Group>
      </Form>
    </div>
  );
};