import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { sessionMiddleware } from 'src/common/middleware/session.middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const telegrafModuleOptions: TelegrafModuleOptions = {
  token: process.env.TELEGRAM_BOT_TOKEN,
  launchOptions: {
    dropPendingUpdates: true,
    webhook:
      process.env.NODE_ENV === 'production'
        ? {
            domain: process.env.TELEGRAM_BOT_DOMAIN,
            path: process.env.TELEGRAM_BOT_WEBHOOK_PATH,
          }
        : undefined,
  },
  middlewares: [sessionMiddleware()],
};

export const telegrafModule = TelegrafModule.forRootAsync({
  useFactory: () => telegrafModuleOptions,
});
