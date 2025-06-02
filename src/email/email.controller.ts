import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSendingDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService){}
    @Post('send')
  async sendEmail(
    @Body() dto: EmailSendingDto,
  ): Promise<{ message: string }> {
    console.log('Received DTO:', dto);
    await this.emailService.sendemail(dto);
    return { message: 'Email sent successfully' };
  }
}
