import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageRepository {
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>) { }

    async create(data: Partial<Message>): Promise<Message> {
        const newMessage = new this.messageModel(data);
        return newMessage.save();
    }

    async findByConversation(conversationId: string): Promise<Message[]> {
        return this.messageModel.find({ conversationId }).sort({ createdAt: 1 }).exec();
    }

    async deleteOne(id: string, userId: string): Promise<Message | null> {
        return this.messageModel.findOneAndDelete({ _id: id, senderId: userId }).exec();
    }
}
