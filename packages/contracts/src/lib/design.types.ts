export interface IDesign {
    _id?: string;
    name: string;
    category: string;
    amount: number;
    description: string;
    type: string;
    specifications: ISpecification[];
    selections?: ISpecification[];
    colors: any;
    images: any[];
    catalogDisplay: boolean;
}

export class ISpecification {
    size!: string;
    description?: string;
    colors: IColors[] = [];
    selectedColors: IColors[] = [];
    amount!: number;
    quantity!: number;
    inStock?: number;
}

export interface IColors {
    _id: string;
    name: string;
    code: string;
    hex: string;
    slugName?: string;
    rgb?: string;
}