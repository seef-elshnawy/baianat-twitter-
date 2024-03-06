import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { buildRepository } from 'src/common/database/database-repository.builder';
import { User } from 'src/user/entities/user.entity';

@Module({
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
