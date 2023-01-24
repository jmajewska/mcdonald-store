export interface OrdersCountPerCategoryModel {
  ordersCount: number;
  category: string;
}

export interface CategoriesStatsModel {
  category: string;
  total: number;
  count: number;
  average: number;
}

export interface OrderStatsModel {
  average: number;
  categories: CategoriesStatsModel[];
  count: number;
  mostPopular: CategoriesStatsModel;
  total: number;
}
