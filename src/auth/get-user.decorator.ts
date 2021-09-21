import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.schema';

export const Getuser = createParamDecorator(
  (data, req: ExecutionContext): User => {
    const request = req.switchToHttp().getRequest();

    return request.user;
  },
);
