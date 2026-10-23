import { IClient } from "./client.types";
import { IOrderItem, IOrderType, OrderStatuses } from "./order.types";

export interface IAdminProfile {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    countryCode: string;
    tel: string;
    formattedPhone: string;
    role: string;
}

export interface IAdminLogin {
    email?: string;
    phone?: string;
    password: string;
}

export interface IAdminMenu {
    id: number;
    path: string;
    icon?: string;
    badge?: number;
    name: string;
    slug?: string;
    submenu?: IAdminMenu[]; 
}

export interface ITailor {
  _id: string;
  fullname: string;
  firstname: string;
  lastname: string;
  address?: string;
  email: string;
  countryCode?: string; 
  tel?: string;
  username?: string;
  status?: string;
  profileImg?: string;
  subscription?: any;
  studioName: string;
  avatar: string;
  location: string;
  clients?: IClient[];
  orders?: IOrderItem[];
  metrics: {
    totalClients: number;
    totalOrders: number;
    totalRevenue: string;
    totalReferrals: number;
    referralEarnings: string;
  };
  createdAt: string;
}

export interface Order {
  id: string;
  clientName: string;
  garmentType: string;
  amount: string;
  paymentStatus: 'Paid' | 'Deposit Paid' | 'Pending';
  fulfillmentStatus: 'In Production' | 'Fitting' | 'Completed' | 'Delivered';
  dateDate: string;
}

export interface Payment {
  id: string;
  clientName: string;
  amount: string;
  method: 'Card' | 'Bank Transfer' | 'USSD';
  date: string;
  status: 'Completed' | 'Refunded' | 'Failed';
}

export interface Referral {
  id: string;
  tailorName: string;
  joinedDate: string;
  commissionEarned: string;
  status: 'Active' | 'Pending';
}

export interface Measurement {
  name: string;
  value: string;
}

export interface OrderItem {
  id: string;
  name: string;
  type: 'Bespoke' | 'Ready to Wear';
  category: string;
  selectedSize?: string;
  measurements?: Measurement[];
  estimatedDays: number;
  spentDays: number;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface QuotationLog {
  id: string;
  date: string;
  version: string;
  amount: number;
  proposedBy: 'Tailor' | 'Client';
  note: string;
  status: 'Rejected' | 'Countered' | 'Agreed';
}

export interface Client {
  id: string;
  fullname: string;
  firstname: string;
  avatar?: string;
  lastname: string;
  email: string;
  phone: string;
  phoneNo?: string;
  address?: string;
  totalOrders?: number;
  preferredStyle?: string;
  lastOrderDate?: string;
  status?: string;
  createdAt: string;
}

export interface IAdminOrder {
  id: string;
  client: Client;
  tailor: ITailor;
  type: IOrderType;
  status: OrderStatuses;
  datePlaced: string;
  estimatedCompletionDate: string;
  dueDate: string;
  items: OrderItem[];
  quotationHistory: QuotationLog[];
  payment: {
    basePrice: number;
    tailoringFee: number;
    rushFee: number;
    discount: number;
    tax: number;
    finalAgreedAmount: number;
    amountPaid: number;
    paymentMethod: string;
    paymentStatus: 'Paid in Full' | 'Partially Paid' | 'Unpaid';
  };
  notes?: string;
}

/* Mock Data */
export const admin_menus: IAdminMenu[] = [
    { id: 1, path: 'app/dashboard', name: 'Dashboard', icon: 'dashboard', slug: 'dashboard' },
    { id: 2, path: 'app/orders', name: 'Orders', icon: 'shopping-bag-4', slug: 'orders' },
    { id: 3, path: 'app/tailors', name: 'Tailors', icon: 'scissors', slug: 'tailors' },
    { id: 4, path: 'app/users', name: 'Users', icon: 'user-community', slug: 'users' },
    { id: 5, path: 'app/plans', name: 'Packages', icon: 'archive-stack', slug: 'plans' },
    { id: 6, path: 'app/subscriptions', name: 'Subscriptions', icon: 'file-list', slug: 'subscriptions' },
    { id: 7, path: 'app/payments', name: 'Payments', icon: 'bank-card', slug: 'payments' },
    { id: 8, path: 'app/settings', name: 'Settings', icon: 'settings-5', slug: 'settings' },
    { id: 9, path: 'app/activities', name: 'Activities', icon: 'history', slug: 'activities' },
]