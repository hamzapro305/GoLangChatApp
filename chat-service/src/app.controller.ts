import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './app.service';
import { CreateConversationDto, AddParticipantDto, LeaveConversationDto } from './dto/chat.dto';
import { Conversation } from './schemas/conversation.schema';

@Controller('conversations')
export class AppController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  async create(@Body() data: CreateConversationDto): Promise<{ conversation: Conversation }> {
    const conversation = await this.chatService.createConversation(data);
    return { conversation };
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<{ userConversations: Conversation[] }> {
    const userConversations = await this.chatService.findByUserId(userId);
    return { userConversations };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<{ conversation: Conversation }> {
    const conversation = await this.chatService.findById(id);
    return { conversation };
  }

  @Post(':id/participants')
  async addParticipant(@Param('id') id: string, @Body() body: AddParticipantDto): Promise<{ conversation: Conversation | null }> {
    const conversation = await this.chatService.addParticipant(id, body.userId);
    return { conversation };
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string, @Body() body: LeaveConversationDto): Promise<{ conversation: Conversation | null }> {
    const conversation = await this.chatService.leaveConversation(id, body.userId);
    return { conversation };
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string): Promise<{ success: true }> {
    await this.chatService.deleteConversation(id);
    return { success: true };
  }
}
