// interfaces.ts

// Interfejs za podatke o proizvodu
export interface CartItem {
  id: number; // Change to number for consistency
  cartItemId: number; // Add this field for unique identification of the cart item
  productId: number;
  title: string;
  description?: string; // Optional if not always present
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage: number;
  total?: number; // Optional if not always calculated client-side
  discountedTotal?: number; // Optional for backend-provided values
  rating?: number; // Optional if not always present
}

// Interfejs za podatke o korpi
export interface Cart {
  cartItems: CartItem[];
  cartId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

// Interfejs za korisničke podatke
export interface User {
  username: string;
  email: string;
  id: number;
  token: string;
  cart: Cart;
}

