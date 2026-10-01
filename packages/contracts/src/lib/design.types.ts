export interface IDesign {
    _id?: string;
    name: string;
    category: string;
    amount: number;
    description: string;
    type: string;
    sizes: any;
    colors: any;
    images: any[];
    catalogDisplay: boolean;
}