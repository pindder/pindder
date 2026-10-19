export class CreatePaymentDto {
    currency?: string;
    idempotencyKey?: string;
    orderId?: string;
    plan_id?: number;
    plan_code?: string;
    amount?: number;
    callbackUrl!: string; 
    startDate?: string;
    authorization?: string;
}
