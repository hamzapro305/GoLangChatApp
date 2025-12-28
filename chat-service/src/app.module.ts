import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ChatService } from './app.service';
import { ChatRepository } from './repositories/chat.repository';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI_CHAT || 'mongodb://admin:admin@localhost:27017/conversation-db'),
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
  ],
  controllers: [AppController],
  providers: [ChatService, ChatRepository],
})
export class AppModule { }
