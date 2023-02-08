import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class UserKeys {
  userId: string;
  email: string;
}

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();

    return request.user ? (request.user as UserKeys) : null;
  },
);
