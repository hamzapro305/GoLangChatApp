import { IsArray, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateConversationDto {
    @IsArray()
    @IsString({ each: true })
    participants: string[];

    @IsString()
    createdBy: string;

    @IsOptional()
    @IsBoolean()
    isGroup?: boolean;

    @IsOptional()
    @IsString()
    groupName?: string;
}

export class AddParticipantDto {
    @IsString()
    userId: string;
}

export class LeaveConversationDto {
    @IsString()
    userId: string;
}
