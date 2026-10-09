export interface INotification {
    _id: string; 
    data: any;
    client?: any;
    tailor: any;
    customer?: any;
    type: string;
    action: string;
    title: string;
    icon: string;
    message: string;
    status: string;
}