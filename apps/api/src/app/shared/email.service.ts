import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { Brand } from '../brands/schemas/brand.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class EmailService {
     private readonly resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendWelcomeEmail(to: string, name: string) {
        const { data, error } = await this.resend.emails.send({
        from: 'Pindder <onboarding@resend.dev>',
        to: [to],
        subject: 'Welcome to Pindder',
        html: `
            <h1>Welcome, ${name}!</h1>
            <p>Thanks for signing up.</p>
            <p></p>
        `,
        });

        if (error) {
            console.error('Resend error:', error);
            throw new InternalServerErrorException('Failed to send email');
        }

        return data;
    }

    async sendOneTimeLoginCode(user: User | Tailor | Brand, code: string) {
        const { data, error } = await this.resend.emails.send({
        from: 'Pindder <onboarding@resend.dev>',
        to: [user!.email],
        subject: 'Login Request: OTP Code',
        html: `
            <h1>Welcome back, ${user!.username}!</h1>
            <p>Here is your one time login code. if you have not initiated this request please kindly ignore this message but ensure that your email is secure</p>
            <p>${code}</p>
        `,
        });

        if (error) {
            console.error('Resend error:', error);
            throw new InternalServerErrorException('Failed to send email');
        }

        return data;
    }

}
