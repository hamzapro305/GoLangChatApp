import { Injectable } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { Message } from './schemas/message.schema';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessagingService {
  constructor(private messageRepository: MessageRepository) { }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    return this.messageRepository.create({
      ...data,
      replyTo: data.replyTo ? new Types.ObjectId(data.replyTo) : undefined,
    } as Partial<Message>);
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    return this.messageRepository.findByConversation(conversationId);
  }

  async deleteMessage(id: string, userId: string): Promise<Message | null> {
    return this.messageRepository.deleteOne(id, userId);
  }
}
