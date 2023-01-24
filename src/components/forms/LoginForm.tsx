import React, { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import { userService } from "../../services/userService";
import styles from './Form.module.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/authContext";
import { AuthStates } from "../../models/authModel";
import { Link } from 'react-router-dom';
import { Form } from "react-bootstrap";
import { ErrorMessage } from "../../shared/errorMessage/ErrorMessage";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from "react-redux";
import { getCategories } from "../../store/actions/categories-actions";
import { AppDispatch } from "../../store/store";

interface BackendErrors {
  password?: string;
  email?: string;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('This field is required')
    .email('Enter valid email address'),
  password: yup
    .string()
    .required('This field is required')
    .min(6, 'Your password must be at least 6 characters')
});

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});
  const dispatch = useDispatch<AppDispatch>()
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });


  const submitHandler = handleSubmit(async (values) => {
    userService.loginUser(values)
      .then((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.email);
        localStorage.setItem('isAdmin', res.isAdmin)
        return res
      })
      .then(res => {
        authCtx.dispatch({ type: AuthStates.LOGIN, payload: { isAdmin: res.isAdmin, user: res.username } });
        dispatch(getCategories())
        navigate('/');
      })
      .catch((err) => {
        setBackendErrors(err.response.data.errors)
      });
  });

  return (
    <div className="flex-wrapper-max">
      <div className={styles.formWrapper}>
        <Form className="form" onSubmit={submitHandler}>
          <Form.Group className={styles.formField} >
            <Form.Control className={styles.input} type="text" {...register('email')} />
            <Form.Label htmlFor="email">email</Form.Label>
            {backendErrors.email && <ErrorMessage>{backendErrors.email}</ErrorMessage>}
            {errors?.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </Form.Group>
          <Form.Group className={styles.formField} >
            <Form.Control type="password" {...register('password')} />
            <Form.Label htmlFor="password">password</Form.Label>
            {backendErrors.password && <ErrorMessage>{backendErrors.password}</ErrorMessage>}
            {errors?.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </Form.Group>
          <Form.Group className={styles.btn}>
            <button >Log in</button>
          </Form.Group>
        </Form>
      </div>
      <div>You dont have an account? <Link className={styles.link} to='/signup'>Sign up</Link></div>
    </div>
  );
};
// 63c74d42acfcd216c08bd923