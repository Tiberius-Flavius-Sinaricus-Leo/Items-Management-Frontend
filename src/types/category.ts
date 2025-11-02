export type CategoryRequest = {
  name: string;
  description: string;
  bgColor: string;
}

export type CategoryResponse = {
  bgColor: string;
  categoryId: string; 
  createdAt: string;
  description: string;
  name: string;
  updatedAt: string;
  itemsCount?: number;
}

export type CategoryFrontendEntry = {
  categoryId: string;
  name: string;
  description: string;
  bgColor: string;
  itemsCount?: number;
}

export type CategoryFormState = {
  open: boolean;
  current: CategoryFrontendEntry;
  title: string;
  isUpdate: boolean;
}
