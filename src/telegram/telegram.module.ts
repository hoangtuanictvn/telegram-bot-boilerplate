import { Module } from '@nestjs/common';
import { telegrafModule } from 'src/config/config.telegraf';
import { HomeController } from './controllers/home.controller';

@Module({
    imports:[
        telegrafModule,
    ],
    providers: [
        HomeController
    ]
})
export class TelegramModule {}
