import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from 'src/users/userLogInDto.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async logIn(logInDto: LogInDto): Promise<{ token: string }> {
        const {username, password} = logInDto

        const user = await this.userModel.findOne({username})
        if (!user) {
            throw new UnauthorizedException("User does not exists!")
        }

        if (password != user.password){
            throw new UnauthorizedException("Wrong password!")
        }
        
        const token = this.jwtService.sign({ username: user.username})
        return {token}
    }
}
