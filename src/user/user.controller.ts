import { Controller, Get } from '@nestjs/common';
// for deployment testing
@Controller('user')
export class UserController {
  @Get('me')
  getReq() {
    console.log('running');
    return 'hello world';
  }
}
