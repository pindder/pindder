export enum Status {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IProfile {
  firstname?: string;
  lastname?: string;
  address?: string;
  email?: string;
  phoneNo?: string;
}