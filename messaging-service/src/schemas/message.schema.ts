import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ required: true })
    conversationId: string;

    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    attachmentUrl: string;

    @Prop({ default: 'text' })
    type: string;

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    replyTo: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
