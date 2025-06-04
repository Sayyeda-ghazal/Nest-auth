import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsDto } from './dto/posts.dto';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomRequest } from 'src/types/custom-request.interface';

@Controller('posts')
export class PostsController {
    constructor(
        private postService: PostsService
    ){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    create_post(@Req() req: CustomRequest, @Body() post: PostsDto){
        const userId = req.user['_id'];
        return this.postService.createPost(userId, post)
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    get_posts(){
        return this.postService.getPosts();
    }

    @Get('get/:id')
    @UseGuards(JwtAuthGuard)
    async getposts_byid(@Param('id')
    id: string){
        return this.postService.getPostsbyid(id)
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update_posts(@Param('id') id: string, @Body() posts: PostsDto){
        return this.postService.updatePosts(id, posts);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async delete_post(@Param('id') id:string){
        return this.postService.deltePosts(id);
    }
}
