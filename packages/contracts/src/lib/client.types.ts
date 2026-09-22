//import { IOrder } from "./order.types";

export interface IClient {
    _id?: string;
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    phoneNo: string;
    gender: string;
    referee: string;
    // measurements?: IMeasurement;
    // orders?: IOrder;
}

export interface IMeasurement {
    _id?: string;
    client?: string;
    User?: string;
    measurements: any;
    notes?: string;
}