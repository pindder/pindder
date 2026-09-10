export class CreateAdminDto {
    fullname?: string;
    firstname!: string;
    lastname!: string;
    email!: string;
    phoneNo!: string;
    role!: string;
    status!: string;
    country?: string;
    state?: string;
    postalCode?: string;
    password!: string;
}
