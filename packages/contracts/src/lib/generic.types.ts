export interface IResponse<T> {
    statusCode: number;
    msg: string;
    data?: T;
    total?: number;
    page?: number;
    size?: number;
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
  metadata?: any;
}

export interface IBankDetail {
  _id?: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  sortCode?: string;
  disabled: boolean;
}