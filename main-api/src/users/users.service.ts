import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    Object.assign(user, { ...user, ...updateUserDto });
    return this.userRepository.save(user);
  }

  async updateQuantity(id: string, operation: string) {
    console.log(id);

    try {
      const user = await this.userRepository.findOne(id);

      if (operation === 'SUM') {
        Object.assign(user, { ...user, notifications: user.notifications + 1 });
      } else {
        Object.assign(user, { ...user, notifications: user.notifications - 1 });
      }

      return this.userRepository.save(user);
    } catch (err) {
      return {
        error: 'Esse usuário não existe',
      };
    }
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
