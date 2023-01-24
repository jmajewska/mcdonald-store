export interface IngredientsModel {
  name: string;
  count: number;
  price: number;
}

export interface ProductModel {
  _id: number;
  name: string;
  category_type: string;
  ingredients: IngredientsModel[];
  isVege: boolean;
  default_price: number;
  picture: string;
  isAvailable:boolean;
}

export interface CategoriesModel {
  _id: number;
  name: string;
}
