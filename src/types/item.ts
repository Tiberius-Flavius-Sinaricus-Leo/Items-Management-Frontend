export type ItemRequest = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export type ItemResponse = {
  itemId: string;
  name: string; 
  createdAt: string;
  description: string;
  price: number;
  updatedAt: string;
  categoryName: string;
  categoryId: string
}

export type ItemFrontendEntry = {
  itemId: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
}

export type ItemFormState = {
  open: boolean;
  current: ItemFrontendEntry;
  title: string;
  isUpdate: boolean;
}
