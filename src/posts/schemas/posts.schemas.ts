import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { User } from "src/auth/schemas/user.schema"

@Schema()
export class Posts{
    
    @Prop()
    id: number;

    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: () => User})
    authorId: number;
}

export const PostSchema = SchemaFactory.createForClass(Posts);