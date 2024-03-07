import { Module } from '@nestjs/common';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroupResolver } from './security-group.resolver';

@Module({
  providers: [SecurityGroupResolver, SecurityGroupService],
})
export class SecurityGroupModule {}
