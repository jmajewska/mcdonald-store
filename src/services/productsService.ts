import { http } from './api';
import axios from 'axios';
import { ProductModel } from '../models/productsModel';

const BASE_URL = 'http://localhost:3000';

const getAllProducts = (category?: string, search?:string) => {
  return http
  .get(`/products`,
    {params: {
      category,
      search
  }}).then((res) => res.data);
};

const postNewProduct = (newProduct: any) => {
  return http
    .post(`/products`, newProduct, { headers: {
      'Content-Type': 'multipart/form-data'
    }})
    .then((res) => res.data);
};

const getProduct = (id: string) => {
  return http.get(`/products/${id}`).then((res) => res.data);
};

const deleteProduct = (id: number) => {
  return http
    .delete(`/products/${id}`)
    .then((res) => res.data)
}

const updateProduct = (id:number, body:any) => {
  return http
    .put(`/products/${id}`,body)
    .then((res) => res.data)
}

export const productsService = {
  getAllProducts,
  postNewProduct,
  getProduct,
  deleteProduct,
  updateProduct
};
