export class CreateAdminDto {
    fullname?: string;
    firstname!: string;
    lastname!: string;
    email!: string;
    countryCode?: string;
    tel?: string;
    formattedPhoneNo?: string;
    profileImg?: string;
    roles!: string[];
    status?: string;
    country?: string;
    state?: string;
    postalCode?: string;
    password!: string;
}
