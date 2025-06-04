import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schemas/posts.schemas';
import mongoose from 'mongoose';
import { PostsDto } from './dto/posts.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Posts.name)
        private postModel: mongoose.Model<Posts>,
        private readonly userService: UserService
    ){}

    async createPost(userId: string, postsdto: PostsDto){
        const user = await this.userService.ValidateUserbyId(userId);
        const post = new this.postModel({
            ...postsdto,
            authorId: userId,
        })
        return await post.save();
    }

    async getPosts(){
        const posts = await this.postModel.find()
        if(!posts) throw new NotFoundException("No posts found");
        return posts;
    }

    async getPostsbyid(id: string){
        const posts = await this.postModel.findById(id);
        if(!posts) throw new NotFoundException("No posts found");
        return posts;
    }

    async updatePosts(id: string, posts: PostsDto){
        const post = await this.postModel.findByIdAndUpdate(id, posts, {
            new: true,
            runValidators: true,
        });
        if(!post) throw new NotFoundException("Post not found.")
        return post;
    }

    async deltePosts(id: string){
        const posts = await this.postModel.findByIdAndDelete(id);
        if(!posts) throw new NotFoundException("No posts found");
        return {message: `Post id ${id} deleted successfully`}
    }
    
}
