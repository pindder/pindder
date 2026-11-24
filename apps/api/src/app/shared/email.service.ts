import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { Tailor } from '../tailors/schemas/tailor.schema';
import { User } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { StripeAccount } from '../payments/schemas/stripe-account';

@Injectable()
export class EmailService {
     private readonly resend: Resend;
     private readonly sender_email: string;
     private logger = new Logger(EmailService.name); 

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        
        if(!apiKey) {
            throw new Error('Missing RESEND_API_KEY environment variable');
        }

        // Initialize Resend with key from environment
        this.resend = new Resend(apiKey);
        
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
            this.logger.error('Resend error:', error)
            // throw new InternalServerErrorException('Failed to send email');
            return error;
        }

        return data;
    }

    async sendOneTimeLoginCode(user: User | Tailor, code: string) {
        const { data, error } = await this.resend.emails.send({
            from: this.sender_email,
            to: [user.email],
            subject: 'Login Request: OTP Code',
            html: `
                <h1>Welcome back, ${user.username}!</h1>
                <p>Here is your one time login code. if you have not initiated this request please kindly ignore this message but ensure that your email is secure</p>
                <p>${code}</p>
            `,
        });

        if (error) {
            this.logger.error('Resend error:', error)
            //throw new InternalServerErrorException('Failed to send email');
            return error;
        }

        return data;
    }

    async sendStripeOnboardingMail(user: Tailor, stripeAccount: StripeAccount) {
        const { data, error } = await this.resend.emails.send({
            from: this.sender_email,
            to: [user.email],
            subject: 'Pindder: Complete your payment setup',
            html: `
                <h1>Hello, ${user.username}!</h1>
                <p>We're excited to have you join our growing community of talented tailors and fashion professionals.</p>
                <p>To start receiving payments for orders placed through Pindder, you need to complete your <strong>Stripe Express account setup.</strong></p>
                <p>Stripe is our secure payment partner responsible for processing payments and facilitating payouts directly to your bank account.</p>
                <p><em>Here's what you need to do:</em></p>
                <ol>
                    <li>Click the button below to begin your secure <strong>Stripe Express</strong> onboarding</li>
                    <li>Provide the required personal or business information</li>
                    <li>Complete your identity verification, where required.</li>
                    <li>Add your bank account details for receiving payouts.</li>
                </ol>
                <p><a href=${stripeAccount.onboardingLink}>Complete payment setup</a></p>
                <p>A few things to note:</p>
                <ul>
                    <li>Your payment setup must be completed before you can receieve payouts</li>
                    <li>Ensure that the information you provide is accurate and matches your verification documents.</li>
                    <li>Your banking and identity information are submitted securely through Stripe, not directly to Pindder.</li>
                </ul>
                <p>Once you've completed the setup, you'll be one step closer to receiving payments and growing your business on Pindder.</p>
                <p>Thank you for choosing Pindder. We look forward to helping you taking your business further!</p>
                <p>Warm regards,</p>
                <p><strong>The Pindder Team</strong></p>
            `,
        });

        if (error) {
            this.logger.error('Resend error:', error)
            //throw new InternalServerErrorException('Failed to send email');
            return error;
        }

        return data;
    }

    async sendStripeCompletedSetup(user: Tailor, stripeAccount: StripeAccount) {
        const { data, error } = await this.resend.emails.send({
            from: this.sender_email,
            to: [user.email],
            subject: 'Pindder: Complete your payment setup',
            html: `
                <h1>Hello, ${user.username}!</h1>
                <p>Congratulations! 🎉</p>
                <p>You've successfully completed your Pindder payment account setup.</p>
                <p>We're delighted to have you one step closer to growing your tailoring business on Pindder.</p>
                <p>Your Stripe Express account is now set up, giving you access to manage your payment information, track your earnings, view payouts and manage your banking details.</p>
                <p><em>You can access your payment dashboard using the link below:</em></p>
                <p><a href=${stripeAccount.loginLink}>Access My Payment Dashboard</a></p>
                
                <p>From your dashboard, you can:</p>
                <ul>
                    <li>View your earnings and payment history.</li>
                    <li>Track your payouts and their status.</li>
                    <li>Manage your bank account details.</li>
                    <li>Update your personal or business information.</li>
                    <li>Review your payment account details.</li>
                </ul>
                <p>You're all set with your payment onboarding! Continue setting up your tailoring profile, showcase your work and get ready to connect with customers looking for your services.</p>
                <p>Thank you for being part of Pindder. We're excited to support your journey and help your business reach more customers.</p>
                <p>Warm regards,</p>
                <p><strong>The Pindder Team</strong></p>
                <p><em>Your craft. Your business. More opportunities.</em></p>
            `,
        });

        if (error) {
            this.logger.error('Resend error:', error)
            //throw new InternalServerErrorException('Failed to send email');
            return error;
        }

        return data;
    }
}