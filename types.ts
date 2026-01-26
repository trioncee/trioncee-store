
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface OrderDetails {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  date: string;
}
