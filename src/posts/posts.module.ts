import { Module} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './schemas/posts.schemas';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]), // ✅ register the model
    UserModule, // ✅ if you're injecting UserService
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
