export interface IVerification {
  code: string
}

export interface ILogin {
  email: string;
  password: string;
}

export interface TailorReg {
  fullname: string;
  email: string;
  phoneNo: string;
  gender: string;
  referralCode: string;
}

export interface IProfile {
  firstname?: string;
  lastname?: string;
  address?: string;
  email?: string;
  phoneNo?: string;
}