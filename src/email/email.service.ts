import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'; 
import { EmailSendingDto } from './dto/email.dto';



@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService){

    }
    emailTransport(){
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth:{
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
        return transporter;
    }
    async sendemail(dto: EmailSendingDto){
        const { recipients, subject, html} = dto;
        const transport = this.emailTransport();

        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: recipients,
            subject: subject,
            html: html,
        };
        try {
            await transport.sendMail(options);
            console.log('Email sent successfully!');
          } catch (error) {
            console.log('Error sending mail:', error);
            throw new Error('Failed to send email'); // throw to controller
          }
        }
}
