

export interface IFoodCategory {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
}

export interface IFoodCategoryAdmin {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  parent: { id: number; name: string } | null;
  children: { id: number; name: string }[];
  foodCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFoodIngredient {
  id: number;
  quantityGrams: number;
  foodId: number;
  ingredientId: number;
  createdAt?: string;
  updatedAt?: string;
  ingredient?: {
    id: number;
    ingredientName: string;
    description?: string | null;
    imageUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface IFood {
  id: number;
  foodName: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryId?: number | null;
  foodCategory?: IFoodCategory | null;
  defaultServingGrams?: number | null;
  createdAt?: string;
  updatedAt?: string;
  foodIngredients?: IFoodIngredient[];
}

export interface ICreateFoodRequest {
  foodName: string;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
  defaultServingGrams?: number;
}

export interface IUpdateFoodRequest {
  foodName?: string;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
  defaultServingGrams?: number;
}

export interface ICreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
}

export interface IUpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: number | null;
}
