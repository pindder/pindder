export class CreateNotificationDto {
    data!: any;
    initiator!: any;
    dependent!: any;
    type!: string;
    action!: string;
    title!: string;
    message!: string;
    icon?: string;
}
