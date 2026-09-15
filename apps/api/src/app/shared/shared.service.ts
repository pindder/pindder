import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../tokens/schemas/token.schema';
import { AccountTypes, TokenStatus, TokenTypes } from '@pindder/contracts';
import { generateCode } from './helpers';

@Injectable()
export class SharedService {
    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}

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
            throw new InternalServerErrorException();
        }
    }

    async hasValidToken(acct_id: any) {
        try {
            const acct_token = await this.tokenModel.findOne({ 
                $or: [
                    { tailor: acct_id,}, 
                    { user: acct_id }, 
                    { brand: acct_id}
                ]}
            );

            if(!acct_token) {
                return { hasToken: false };
            } else {
                return { hasToken: true, existing_token: acct_token };;
            }
        } catch(error){
            throw new InternalServerErrorException();
        }
    }

    async createToken(acctType: string, acct_id: any, tokenType?: string) {
        const token = new this.tokenModel();

        token.type = tokenType ?? TokenTypes.CODE;
        token.token = generateCode();
        token.status = TokenStatus.ACTIVE;
        token.accountType = acctType;

        if(acctType === AccountTypes.TAILOR) token.tailor = acct_id;
        if(acctType === AccountTypes.BRAND) token.brand = acct_id;
        if(acctType === AccountTypes.USER) token.user = acct_id;

        await token.save(); 

        return token;
    }

    async updateToken(acct_id: any, tokenType: string, newToken?: string) {
        const token = await this.tokenModel.findOneAndUpdate({ $or: [{ tailor: acct_id }, { user: acct_id }, { brand: acct_id }] }, {
            type: tokenType,
            token: newToken ?? generateCode(),
            status: TokenStatus.ACTIVE
        }, { upsert: true, new: true });

        return token;
    }
}
