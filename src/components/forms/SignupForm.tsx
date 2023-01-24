import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { userService } from '../../services/userService';
import styles from './Form.module.scss';
import { ErrorsModel } from '../../models/authModel';
import { Form } from "react-bootstrap";
import { ErrorMessage } from '../../shared/errorMessage/ErrorMessage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required('This field is required'),
  email: yup
    .string()
    .required('This field is required')
    .email('Enter valid email'),
  password: yup
    .string()
    .required('This field is required')
    .min(6, 'Password must contain at least 6 characters')
});

export const SignupForm = () => {
  const navigate = useNavigate();
  const [backendErrors, setErrors] = useState<ErrorsModel>({});

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  const submitHandler = handleSubmit((values) => {
    userService.signupUser(values)
      .then((res) => {
        navigate('/login');
      })
      .catch((err) => {
        if (err.status === 400) {
          Object.entries(err.data.errors).forEach(([field, message]) => {
          });
        }
        setErrors(err.response.data.errors);
      });
  });

  return (
    <div className="flex-wrapper-max">
      <div className={styles.formWrapper}>
        <Form className="form" onSubmit={submitHandler}>
          <Form.Group className={styles.formField}>
            <Form.Control type="text" id="username" {...register('username')} />
            <Form.Label htmlFor="username">username</Form.Label>
            {backendErrors?.username && <ErrorMessage>{backendErrors.username}</ErrorMessage>}
            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
          </Form.Group>
          <Form.Group className={styles.formField} >
            <Form.Control className={styles.input} type="text" id="email" {...register('email')} />
            <Form.Label htmlFor="email">email</Form.Label>
            {backendErrors?.email && <ErrorMessage>{backendErrors.email}</ErrorMessage>}
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </Form.Group>
          <Form.Group className={styles.formField} >
            <Form.Control type="password" id="password" {...register('password')} />
            <Form.Label htmlFor="password">password</Form.Label>
            {backendErrors?.password && <ErrorMessage>{backendErrors.password}</ErrorMessage>}
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </Form.Group>
          <button className={styles.btn}>Create an accont</button>
          <Link to='/login' className={styles.link}>Login</Link>
        </Form>
      </div>
    </div>
  );
};