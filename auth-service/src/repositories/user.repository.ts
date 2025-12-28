import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
}
