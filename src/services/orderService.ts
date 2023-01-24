import { http } from './api';
import { OrderStatsModel } from '../models/orderModel';

const addToOrder = (body: any, orderId?: number | null) => {
  if (!orderId) {
    return http.post(`/order`, body).then((res) => {
      return res.data;
    });
  } else {
    return http.put(`/order/${orderId}`, body).then((res) => res.data);
  }
};

const deactivateOrder = (id: number) => {
  return http.patch(`/order/${id}`).then((res) => res.data);
};

const getCategories = () => {
  return http.get(`/categories`).then((res) => res.data);
};

const getUserCurrentOrder = () => {
  return http.get('/order/active').then((res) => res.data);
};

const getOrder = (id: string) => {
  return http.get(`/order/${id}`).then((res) => res.data);
};

const getSummary = (params?: any) => {
  return http
    .get<OrderStatsModel[]>(`/order/all-orders/category-summary`, {
      params,
    })
    .then((res) => res.data);
};

const deleteCategory = (id: number) => {
  return http.delete(`/categories/${id}`).then((res) => res);
};

const addCategory = (body: { name: string }) => {
  return http.post(`/categories`, body).then((res) => res.data);
};

const deleteProductFromOrder = (id: number, body: any) => {
  return http.put(`/order/modify/${id}`, body).then((res) => res.data);
};

const confirmOrder = (id: number, order: any) => {
  return http
    .put(`/order/confirm/${id}`, order)
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

export const orderService = {
  addToOrder,
  getCategories,
  getSummary,
  addCategory,
  deleteCategory,
  getUserCurrentOrder,
  deactivateOrder,
  getOrder,
  confirmOrder,
  deleteProductFromOrder,
};
