import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const getCategories = createAsyncThunk('getCategories', async () => {
  const res = await orderService.getCategories();
  return res.data;
});

export const getCategoriesType = typeof getCategories