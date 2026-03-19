// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: User): User {
    const newUser = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updatedUser: User): User{
    const index = this.users.findIndex((user) => user.id === id);
    this.users[index] = { ...updatedUser, id };
    return this.users[index];
  }

  delete(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
