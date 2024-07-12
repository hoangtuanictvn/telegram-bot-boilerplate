import { session } from 'telegraf';
import { Redis } from '@telegraf/session/redis';

export const sessionMiddleware = () : any => {
  if (process.env.NODE_ENV === 'production') {
    const store = Redis({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    return session({ store });
  } else {
    return session();
  }
};
