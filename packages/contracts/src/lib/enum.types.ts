export enum MeasurementTypes {
    STANDARD = "STANDARD",
    CUSTOM = "CUSTOM"
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum PaymentStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum AccountTypes {
    TAILOR = "TAILOR",
    BRAND = "BRAND",
    BUSINESS = "BUSINESS",
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
    NOTIFICATION = "NOTIFICATION",
}

export enum DeliveryMethods {
    PICKUP = "PICKUP",
    SHIPPING = "SHIPPING",
    MEETUP = "MEETUP"
}