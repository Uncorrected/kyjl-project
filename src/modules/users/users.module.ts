import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
    UtilsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
