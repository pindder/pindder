import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { Brand } from '../brands/schemas/brand.schema';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { User } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
     private readonly resend: Resend;
     private readonly sender_email: string;

    constructor(private readonly configService: ConfigService) {
        // Initialize Resend with key from environment
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
        
        // Read sender email from environment, fallback if not set
        this.sender_email = this.configService.get<string>(
        'SENDER_EMAIL', 
        'Pindder <hello@pindder.com>'
        );
    }

    async sendWelcomeEmail(to: string, name: string) {
        const { data, error } = await this.resend.emails.send({
        from: this.sender_email,
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
        from: this.sender_email,
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
