import { Global, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../tokens/schemas/token.schema';
import { TokenStatus, TokenTypes } from '@pindder/contracts';
import { generateCode } from './helpers';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Global()
@Injectable()
export class SharedService {
    private readonly SALT_ROUNDS = 15;

    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}

    generateId(): string {
        return uuidv4();
    }

    async findToken(tokenString?: string) {
        try {
            const token = await this.tokenModel.findOne({ 
                $or: [
                    { token: tokenString }
                ]
            });

            if(!token) {
                throw new NotFoundException();
            }

            return token;
        } catch(error: any) {
            throw new InternalServerErrorException(`${error}`);
        }
    }

    async hasValidToken(acct: any) {
        try {
            const acct_token = await this.tokenModel.findOne({ 'account.email': acct.email }).exec();
            
            if(!acct_token) {
                return { hasToken: false };
            } else {
                if(acct_token && acct_token.status === TokenStatus.ACTIVE) {
                    return { hasToken: true, existing_token: acct_token, status: TokenStatus.ACTIVE };
                }
                return { hasToken: true, existing_token: acct_token, status: TokenStatus.INVALIDATED };
            }
        } catch(error: any){
            throw new InternalServerErrorException(`${error}`);
        }
    }

    async createToken(acctType: string, acct: any, tokenType = '', tkn = '') {
        try {
            const token = new this.tokenModel();

            token.type = tokenType ?? TokenTypes.CODE;
            if(tkn) {
                token.token = tkn
            } else {
                token.token = generateCode();
            }
            token.status = TokenStatus.ACTIVE;
            token.accountType = acctType;

            token.account = acct;

            await token.save(); 

            return token;
        } catch(error: any) {
            throw new InternalServerErrorException(`${error}`);
        }
    }

    async updateToken(acctType: string, acct: any, tokenType: string, newToken?: string) {
        try {
            const token = await this.tokenModel.findOneAndUpdate({ 'account.email': acct.email }, {
                type: tokenType,
                accountType: acctType,
                account: acct,
                token: newToken ?? generateCode(),
                status: TokenStatus.ACTIVE
            }, { upsert: true, returnDocument: "after" });

            return token;
        } catch(error) {
            throw new InternalServerErrorException(`${error}`);
        }
    }

    /**
   * Hashes a plain-text password using bcrypt with standard salt rounds.
   * 
   * @param plainTextPassword The raw password from user input (e.g., registration request)
   * @returns Promise<string> The generated bcrypt password hash to be saved in DB
   */
    async hashPassword(plainTextPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
        return bcrypt.hash(plainTextPassword, salt);
    }

    /**
   * Compares a candidate plain-text password against a stored bcrypt hash.
   * 
   * @param plainTextPassword The login input password to check
   * @param hashedPassword The stored hash retrieved from the database
   * @returns Promise<boolean> True if match succeeds, false otherwise
   */
    async comparePassword(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }
}
