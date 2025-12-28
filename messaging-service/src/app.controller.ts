import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessagingService } from './app.service';
import { CreateMessageDto, DeleteMessageDto } from './dto/message.dto';
import { Message } from './schemas/message.schema';

@Controller('messages')
export class AppController {
  constructor(private readonly messagingService: MessagingService) { }

  @Post()
  async create(@Body() data: CreateMessageDto): Promise<{ message: Message }> {
    const message = await this.messagingService.createMessage(data);
    return { message };
  }

  @Get('conversation/:id')
  async getByConversation(@Param('id') conversationId: string): Promise<{ messages: Message[] }> {
    const messages = await this.messagingService.findByConversation(conversationId);
    return { messages };
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string, @Body() body: DeleteMessageDto): Promise<{ success: true }> {
    await this.messagingService.deleteMessage(id, body.userId);
    return { success: true };
  }
}
