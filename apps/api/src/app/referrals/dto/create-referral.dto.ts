import { TailorSnapshot } from "../../tailors/schemas/tailor.schema";

export class CreateReferralDto {
    referee!: TailorSnapshot;
    referrer!: string;
    refereeSubscription?: string;
}
