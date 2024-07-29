import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./createUserDto.dto";
import { client, walletClient } from "../config";
import { createTestClient, http, publicActions, walletActions } from 'viem'
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');


@Controller('users')
export class UserController{
    
    constructor(private userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    
}