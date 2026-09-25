import { IOrderStyle } from "@pindder/contracts";

export class CreateOrderDto {
    client?: string;
    user?: string;
    tailor?: string;
    styles!: IOrderStyle[];
    deliveryDate!: string[];
    deliveryMethod!: string;
    measurement?: string;
    sizes!: string[];
    quantity!: number;
    status?: string;
    totalAmount!: number;
    totalItems!: number;
    note?: string;
    address?: string;
}
