export class CreateClientDto {
    fullname?: string;
    firstname!: string;
    lastname!: string;
    username!: string;
    email!: string;
    phoneNo!: string;
    referee?: string;
    password?: string;
}
