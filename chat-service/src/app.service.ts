import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';
import { Conversation } from './schemas/conversation.schema';

import { CreateConversationDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) { }

  async createConversation(data: CreateConversationDto): Promise<Conversation> {
    const participants = data.participants.map(id => ({ userId: id, joinedAt: new Date() }));
    return this.chatRepository.create({
      participants,
      leaderId: data.createdBy,
      isGroup: data.isGroup || false,
      groupName: data.groupName,
    });
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return this.chatRepository.findByUserId(userId);
  }

  async findById(id: string): Promise<Conversation> {
    const conv = await this.chatRepository.findById(id);
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async addParticipant(id: string, userId: string): Promise<Conversation | null> {
    return this.chatRepository.update(id, {
      $addToSet: { participants: { userId, joinedAt: new Date() } },
    });
  }

  async leaveConversation(id: string, userId: string): Promise<Conversation | null> {
    return this.chatRepository.update(id, {
      $pull: { participants: { userId } },
    });
  }

  async deleteConversation(id: string): Promise<Conversation | null> {
    return this.chatRepository.delete(id);
  }
}
