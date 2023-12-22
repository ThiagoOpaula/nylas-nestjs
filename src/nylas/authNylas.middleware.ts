// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Nylas = require('nylas');

@Injectable()
export class AuthNylasMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    Nylas.config({
      clientId: process.env.NYLAS_CLIENT_ID,
      clientSecret: process.env.NYLAS_CLIENT_SECRET,
    });

    req.nylas = Nylas.with(process.env.ACCESS_TOKEN);
    next(); // call to indicate that middleware is done and move to the next one
  }
}
