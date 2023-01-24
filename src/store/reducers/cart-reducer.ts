import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductModel } from '../../models/productsModel';
import {
  getOrder,
  deleteProductFromOrder,
  modifyOrder,
} from '../actions/cart-actions';

export interface CartState {
  inplace: boolean;
  products: ProductModel[];
  amount: number;
  date: string;
  _id: number;
  userId: number;
}

export interface initialState {
  cart: CartState;
  isLoading: boolean;
  amount: number;
  productsCount: number;
}

export const initialState: initialState = {
  cart: {
    inplace: false,
    products: [],
    amount: 0,
    date: '',
    _id: 0,
    userId: 0,
  },
  isLoading: false,
  amount: 0,
  productsCount: 0,
};

const cartClice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductModel>) => {
      state.cart.products = [...state.cart.products, action.payload];
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart.products = state.cart.products.filter((product) => {
        return product._id == action.payload;
      });
    },
    setWhereEat: (state, action: PayloadAction<boolean>) => {
      state.cart.inplace = action.payload;
    },
    countAmount: (state, action: PayloadAction<number>) => {
      state.cart.amount = 30.0;
    },
    setOrderId: (state, action: PayloadAction<number>) => {
      state.cart._id = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.cart.products.splice(action.payload, 1);
      state.productsCount = state.cart.products.length;
    },
    clearCart: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrder.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(
        deleteProductFromOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.cart = action.payload;
          state.productsCount = action.payload.products.length;
          state.amount = action.payload.products.reduce(
            (acc: any, curr: any) => {
              return (
                acc +
                +curr.default_price.$numberDecimal +
                +curr.ingredients.reduce((innerAcc: any, innerCurr: any) => {
                  if (innerCurr.count > 1) {
                    return (
                      innerAcc +
                      (+innerCurr.count - 1) * +innerCurr.price.$numberDecimal
                    );
                  }
                  return innerAcc;
                }, 0)
              );
            },
            0
          );
        }
      ),
      builder.addCase(
        getOrder.fulfilled,
        (state, action: PayloadAction<CartState>) => {
          state.cart = action.payload;
          state.isLoading = false;
          state.productsCount = action.payload.products.length;
          state.amount = action.payload.products.reduce(
            (acc: any, curr: any) => {
              return (
                acc +
                +curr.default_price.$numberDecimal +
                +curr.ingredients.reduce((innerAcc: any, innerCurr: any) => {
                  if (innerCurr.count > 1) {
                    return (
                      innerAcc +
                      (+innerCurr.count - 1) * +innerCurr.price.$numberDecimal
                    );
                  }
                  return innerAcc;
                }, 0)
              );
            },
            0
          );
        }
      ),
      builder.addCase(
        modifyOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.cart = action.payload;
          state.isLoading = false;
          state.productsCount = action.payload.products.length;
          state.amount = action.payload.products.reduce(
            (acc: any, curr: any) => {
              return (
                acc +
                +curr.default_price.$numberDecimal +
                +curr.ingredients.reduce((innerAcc: any, innerCurr: any) => {
                  if (innerCurr.count > 1) {
                    return (
                      innerAcc +
                      (+innerCurr.count - 1) * +innerCurr.price.$numberDecimal
                    );
                  }
                  return 0;
                }, 0)
              );
            },
            0
          );
        }
      );
  },
});

export const {
  addToCart,
  removeFromCart,
  setWhereEat,
  countAmount,
  setOrderId,
  deleteProduct,
  clearCart,
} = cartClice.actions;

export default cartClice.reducer;
