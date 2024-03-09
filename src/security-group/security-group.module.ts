import { Module } from '@nestjs/common';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroupResolver } from './security-group.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [SecurityGroupResolver, SecurityGroupService],
})
export class SecurityGroupModule {}
