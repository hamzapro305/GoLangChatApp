import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Participant {
    @Prop({ required: true })
    userId: string;

    @Prop({ default: Date.now })
    joinedAt: Date;

    @Prop()
    leftAt?: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

@Schema({ timestamps: true })
export class Conversation extends Document {
    @Prop({ type: [ParticipantSchema], default: [] })
    participants: Participant[];

    @Prop({ default: false })
    isGroup: boolean;

    @Prop({ required: true })
    leaderId: string;

    @Prop()
    groupName?: string;

    @Prop()
    groupImage?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
