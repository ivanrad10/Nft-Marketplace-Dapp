import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    
    @Prop({ unique: true, required: true})
    username: string;

    @Prop({ required: true})
    name: string;

    @Prop({ required: false})
    avatarUrl?: string;

    @Prop({ required: true})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);