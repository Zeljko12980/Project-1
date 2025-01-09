export interface Product {
  id: string;
  title: string;
  images: string[];
  price: number;
  rating: number;
  thumbnail:string;
  description?: string;
  category: string;
  brand?: string;
  stock?: number;
  discountPercentage?: number;
  
}
