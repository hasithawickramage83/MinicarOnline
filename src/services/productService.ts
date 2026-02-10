import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const mockProducts = async (): Promise<Product[]> => {
  return api.getProducts();
};
