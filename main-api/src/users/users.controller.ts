import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface IdObjectProp {
  value: {
    id: string;
  };
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.remove(id);
    res.status(HttpStatus.OK).send();
  }

  @MessagePattern('create-notification-user')
  increaseNotificationNumber(@Payload() idObject: IdObjectProp) {
    return this.usersService.updateQuantity(idObject.value.id, 'SUM');
  }

  @MessagePattern('read-notification-user')
  decreaseNotificationNumber(@Payload() idObject: IdObjectProp) {
    return this.usersService.updateQuantity(idObject.value.id, 'MINUS');
  }
}
