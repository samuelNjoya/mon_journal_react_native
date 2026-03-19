// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): User | { message: string }{
     const user = this.usersService.findOne(+id);
  if (!user) {
    // eslint-disable-next-line prettier/prettier
    return { message: `Utilisateur avec l'ID ${id} non trouvé.` };
  }
  return user;
  }

  @Post()
  create(@Body() user: User): User {
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: User): User {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    return this.usersService.delete(+id);
  }
}
