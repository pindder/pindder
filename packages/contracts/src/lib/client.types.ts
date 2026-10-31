//import { IOrder } from "./order.types";

import { IOrderItem } from "./order.types";

export interface IClient {
    _id?: string;
    fullname?: string;
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    phoneNo: string;
    gender: string;
    referee?: string;
    createdAt?: string;
    measurements?: IMeasurement[];
    orders?: IOrderItem[];
}

export interface IMeasurement {
    _id?: string;
    name: string;
    description?: string;
    owner: string;
    measurements: any;
    notes?: string;
}