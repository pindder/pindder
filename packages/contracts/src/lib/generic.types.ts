export interface IResponse<T> {
  statusCode: number;
  msg: string;
  data?: T;
  total?: number;
  meta?: IMeta;
}

export interface IMeta {
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  totalNotifications?: number;
  totalNotificationsUnread?: number;
  totalNotificationsRead?: number;
}

export interface GalleryItem {
  src: string;
  w: number; // width in px
  h: number; // height in px
  alt?: string;
}

export interface IPlan {
  _id?: string;
  name: string;
  description?: string;
  amount: number;
  interval: string; // e.g., 'month', 'year'
  features: string[];
  isPopular?: boolean;
  recommended:boolean;
  free: boolean;
  plan_id?: number;
  plan_code?: string;
  metadata?: unknown;
  totalSubscribers?: number;
  subscribers?: unknown[];
}

export interface IBankDetail {
  _id?: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  sortCode?: string;
  disabled: boolean;
}

export interface SettingItem {
  id: string;
  icon: string;
  title: string;
  route?: string;
  path?: string;
  action?: string;
  callback?: () => void;
}

export interface SettingsSection {
  id: string;
  name: string;
  subItems: SettingItem[];
  color?: string;
}

export interface ITelInput {
  countryCode: string;
  tel: string;
}