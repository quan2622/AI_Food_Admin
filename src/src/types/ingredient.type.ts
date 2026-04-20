export interface IAllergen {
  id: number;
  name: string;
  description: string | null;
  imageUrl?: string | null;
  usersAffected?: number;
  ingredientsCount?: number;
  createdAt: string;
  /** Ngày cập nhật (API allergens/admin) */
  updatedAt?: string;
}

export interface ICreateAllergenRequest {
  name: string;
  description?: string;
  ingredientIds?: number[];
}

export interface IUpdateAllergenRequest {
  name?: string;
  description?: string;
  ingredientIds?: number[];
}

export interface IIngredient {
  id: number;
  ingredientName: string;
  description?: string | null;
  imageUrl?: string | null;
  allergensCount?: number;
  foodsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  ingredientNutritions?: Array<{
    servingSize: number;
    servingUnit: string;
    values: Array<{
      value: number;
      nutrient: {
        id: number;
        name: string;
        unit: string;
      };
    }>;
  }>;
}

export interface ICreateIngredientRequest {
  ingredientName: string;
  description?: string;
  imageUrl?: string;
}

export interface IUpdateIngredientRequest {
  ingredientName?: string;
  description?: string;
  imageUrl?: string;
}

export interface IIngredientNutrition {
  id: number;
  servingSize: number;
  servingUnit: string;
  source: string;
  isCalculated: boolean;
  ingredientId: number;
  values?: any[];
  createdAt?: string;
  updatedAt?: string;
}
