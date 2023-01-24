import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoriesModel } from '../../models/productsModel';
import { getCategories, getCategoriesType } from '../actions/categories-actions';

const initialState: CategoriesModel[] = [];

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<CategoriesModel>) => {
      state.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      state.filter((category) => category._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action:PayloadAction<CategoriesModel[]>) => {
      state.splice(0, state.length, ...action.payload);
    })
  }
});

export const {addCategory, deleteCategory} = categoriesSlice.actions;
export default categoriesSlice.reducer;