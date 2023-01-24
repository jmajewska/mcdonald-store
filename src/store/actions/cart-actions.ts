import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import { initialState } from '../reducers/cart-reducer';

interface Type {
  cart: initialState,
  index: number;
}

export const getCurrentOrder = createAsyncThunk('getCurrOrder', async () => {
  const response = orderService.getUserCurrentOrder();
  return response;
});

export const getOrder = createAsyncThunk('getOrder', async (id: string) => {
  const response = await orderService.getOrder(id);
  return response;
});

export const deleteProductFromOrder = createAsyncThunk('deleteOrderProduct', async (body:Type) => {
  const newProducts = body.cart.cart.products.filter((el,idx) => idx !== body.index)
  const newCart = {...body.cart.cart, products: newProducts}
  const newCartToSend = {...body.cart, cart: newCart}
  await orderService.deleteProductFromOrder(body.cart.cart._id, newCartToSend)
  const response = await orderService.getOrder(body.cart.cart._id.toString())
  return response;
})

export const modifyOrder = createAsyncThunk('modifyOrder', async (body:any) => {
  const cartToUpdate = {...body.cart.cart}
  cartToUpdate.products[body.index] = body.updatedProduct;
  await orderService.deleteProductFromOrder(body.cart.cart._id, cartToUpdate)
  const response = await orderService.getOrder(body.cart.cart._id.toString())
  return response
})