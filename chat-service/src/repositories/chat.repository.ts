import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Conversation } from '../schemas/conversation.schema';

@Injectable()
export class ChatRepository {
    constructor(@InjectModel(Conversation.name) private conversationModel: Model<Conversation>) { }

    async create(data: Partial<Conversation>): Promise<Conversation> {
        const newConv = new this.conversationModel(data);
        return newConv.save();
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationModel.find({ 'participants.userId': userId }).exec();
    }

    async findById(id: string): Promise<Conversation | null> {
        return this.conversationModel.findById(id).exec();
    }

    async update(id: string, data: UpdateQuery<Conversation>): Promise<Conversation | null> {
        return this.conversationModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<Conversation | null> {
        return this.conversationModel.findByIdAndDelete(id).exec();
    }
}
