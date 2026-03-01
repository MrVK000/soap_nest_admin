export interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    offer: number;
    image: string;
    productId: string,
    description: string,
    discountPrice: number,
    stock: number,
    reviews: Review[]
}

export interface Order {
    id: number;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentMode: string;
    paymentStatus: string;
    shippingAddress: string;
    district: string;
    state: string;
    pincode: number;
    customerId: string | null;
    createdAt: string;
    updatedAt: string;
    customer: CustomerShort | null;
    items?: OrderItem[];
}

export interface CustomerShort {
    name: string;
    email: string;
}

export interface OrderItem {
    id: number;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    orderId: number;
    product: OrderItemProduct;
}

export interface OrderItemProduct {
    name: string;
    price: string;
}

export interface UpdateOrderStatusPayload {
    paymentStatus: string;
    status: string;
}

export interface loginFormPayload {
    credential: string;
    password: string;
}

export interface Customer {
    name: string;
    customerId: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    createdAt: string;
    updatedAt: string;
    orders: Order[]
}

export interface Message {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    read: boolean;
    message: string;
    createdAt: string;
}

export interface Review {
    id: number;
    comment: string;
    userName: string;
    rating: number;
    productId: string;
    customerId: string | null;
    createdAt: string;
}

export interface Coupon {
    id: number;
    code: string;
    discountPercentage: string;
    active: boolean;
    validTo: string;
    category: string;
    timesUsed: string;
    allowedToUse: string;
    createdAt: string;
    updatedAt: string;
}

export type RevenueData = Record<string, number>;

export interface CreateProductPayload {
  name: string;
  category: string;
  price: number;
  offer: number;
  image: string;
  stock: number;
  description: string;
}

export interface UpdateProductPayload extends CreateProductPayload {
  productId?: string | null;
}

export interface CreateCouponPayload {
  code: string;
  category: string;
  discountPercentage: string;
  active: boolean;
  validTo: string | null;
  allowedToUse: number;
}

export type UpdateCouponPayload = CreateCouponPayload;