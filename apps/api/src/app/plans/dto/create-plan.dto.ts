export class CreatePlanDto {
    name!: string;
    interval!: string;
    features!: string[];
    recommended?: boolean;
    // Convert Naira to Kobo (multiply by 100)
    amount!: number;
    description?: string;
    free?: boolean;
}
