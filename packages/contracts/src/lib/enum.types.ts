export enum MeasurementTypes {
    STANDARD = "STANDARD",
    CUSTOM = "CUSTOM"
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING = 'PENDING',
}

export enum AdminRoles {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    SUPPORT = 'SUPPORT',
    SUPERVISOR = 'SUPERVISOR'
}

export enum PaymentStatus {
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    ABANDONED = 'ABANDONED'
}

export enum NotificationStatus {
    READ = 'READ',
    UNREAD = 'UNREAD'
}

export enum NotificationActions {
    'ORDER_CREATED' = 'ORDER_CREATED',
    'ORDER_DELETED' = 'ORDER_DELETED',
    'ORDER_CANCELLED' = 'ORDER_CANCELLED',
    'CLIENT_CREATED' = 'CLIENT_CREATED',
    'CLIENT_DELETED' = 'CLIENT_DELETED',
    'CLIENT_UPDATED' = 'CLIENT_UPDATED',
    'STYLE_CREATED' = 'STYLE_CREATED',
    'STYLE_DELETED' = 'STYLE_DELETED', 
}

export enum SubscriptionStatus {
    active = 'active', 
    cancelled = 'cancelled', 
    none = 'none',
    suspended = 'suspended',
    expired = 'expired'
}

export enum SubscriptionProviders {
    paystack = 'paystack', 
    'apple_iap' = 'apple_iap', 
    'google_play' = 'google_play'
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum AccountTypes {
    ADMIN = "ADMIN",
    TAILOR = "TAILOR",
    USER = "USER"
}

export enum AuthActions {
    SIGN_UP = "SIGN_UP",
    SIGN_IN = "SIGN_IN",
    VERIFY_TOKEN = "VERIFY_TOKEN",
}

export enum TokenTypes {
    CODE = "CODE",
    JWT = "JWT"
}

export enum TokenStatus {
    INVALIDATED = "INACTIVE",
    ACTIVE = "ACTIVE"
}

export enum DesignTypes {
    READYMADE = "READYMADE",
    BESPOKE = "BESPOKE"
}

export enum Sizes {
    S = 'S', 
    M = 'M', 
    L = 'L', 
    XL = 'XL', 
    '2XL' = '2XL',
    '3XL' = '3XL', 
    '4XL' = '4XL', 
    '5XL' = '5XL'
}

export enum DataTypes {
    CLIENT = "CLIENT",
    DESIGN = "DESIGN",
    ORDER = "ORDER",
    SUBSCRIPTION = "SUBSCRIPTION",
    WITHDRAWAL = "WITHDRAWAL",
    PAYMENT = "PAYMENT",
    NOTIFICATION = "NOTIFICATION",
}

export enum PaymentTypes {
    ORDER = "ORDER",
    SUBSCRIPTION = "SUBSCRIPTION"
}

export enum PaymentMethods {
    CASH = "CASH",
    ONLINE = "ONLINE"
}

export enum DataTypesIcon {
    CLIENT = 'person-outline',
    DESIGN = 'color-palette-outline',
    ORDER = 'bag-outline',
    SUBSCRIPTION = 'cash-outline',
    WITHDRAWAL = 'albums-outline',
    PAYMENT = 'card-outline',
    NOTIFICATION = 'notifications-outline',
}

export enum DeliveryMethods {
    PICKUP = "PICKUP",
    SHIPPING = "SHIPPING",
}