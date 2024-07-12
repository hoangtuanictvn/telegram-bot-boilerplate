import { Module } from '@nestjs/common';
import { PrivatekeyService } from './services/privatekey/privatekey.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './entities/key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Key])],
  providers: [PrivatekeyService],
  exports: [PrivatekeyService],
})
export class KeyModule {}
