export class CreateAddressDto {
    addressLine1!: string;
    addressLine2?: string;
    country?: string;
    state?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    zipCode?: string;
    hq?: boolean;
}
