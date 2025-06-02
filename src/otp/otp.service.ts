import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
    generateOtp(length = 6): string {
        const digits = '0123456789';
        let otp = '';
        const randomBytes = crypto.randomBytes(length);
    
        for (let i = 0; i < length; i++) {
          const index = randomBytes[i] % digits.length;
          otp += digits.charAt(index);
        }
    
        return otp;
      }
}
