import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '@healthbridge/contracts';

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    return data ? user?.[data] : user;
  },
);
