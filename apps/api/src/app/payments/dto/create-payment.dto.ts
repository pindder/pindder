export class CreatePaymentDto {
    idempotencyKey!: string;
    client?: string;
    tailor!: string; 
    customer?: string;
    amount!: number;
    currency?: string;
}
