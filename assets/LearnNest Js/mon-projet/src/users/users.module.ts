import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
   imports: [TypeOrmModule.forFeature([User])], // <-- Ici !
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <-- Export du service pour AuthModule
})
export class UsersModule {}
