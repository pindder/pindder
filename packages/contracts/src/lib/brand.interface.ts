export interface IBrand {
    _id?: string;
    name: string;
    bio?: string;
    logo?: string;
    status?: string;
    website?: string;
    email: string;
    countryCode?: string;
    tel?: string;
    country?: string;
    state?: string;
    region?: string;
}

export interface IAddress {
    _id?: string;
    addressLine1: string;
    addressLine2?: string;
    country?: string;
    state?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    zipCode?: string;
    hq: boolean;
}