import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    conversationId: string;

    @IsString()
    senderId: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    attachmentUrl?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    replyTo?: string;
}

export class DeleteMessageDto {
    @IsString()
    userId: string;
}
