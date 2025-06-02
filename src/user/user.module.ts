// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Or your chosen DB
      host: 'localhost',
      port: 5432,
      username: 'yourusername',
      password: 'yourpassword',
      database: 'yourdatabase',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,  // only in dev
    }),
    UserModule,
    AuthModule,
  ],
  providers: [UserService],
  exports: [UserService], // ✅ Make it available to other modules
})
export class UserModule {}
