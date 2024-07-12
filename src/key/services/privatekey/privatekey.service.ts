/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Key } from '../../entities/key.entity';
import { Repository } from 'typeorm';
import { Keypair } from '@solana/web3.js';
import { base58 } from '@scure/base';
import { ResetUserKeyResult } from 'src/key/key.types';

@Injectable()
export class PrivatekeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepo: Repository<Key>,
  ) {}

  hexToBuffer(hexString: string): Buffer {
    try {
      return Buffer.from(hexString, 'hex');
    } catch (error) {
      throw new Error('Error converting hex key to buffer: ' + error.message);
    }
  }

  encryptData(data: string, iv: Buffer): string {
    const key = this.hexToBuffer(process.env.MASTER_PK);
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedPk = Buffer.concat([cipher.update(data), cipher.final()]);

    return `${iv.toString('hex')}${encryptedPk.toString('hex')}`;
  }

  async reverseKey(pk: string): Promise<string> {
    if (process.env.NODE_ENV == 'development') {
      process.env.PK;
    }
    const iv = this.hexToBuffer(pk.slice(0, 32));
    const encryptedPk = this.hexToBuffer(pk.slice(32, pk.length));
    const key = this.hexToBuffer(process.env.MASTER_PK);
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedPk = Buffer.concat([decipher.update(encryptedPk), decipher.final()]);
    return decryptedPk.toString('utf-8');
  }

  async getUserKey(userId: number): Promise<string> {
    //This is a mocking pkid for development purpose only
    if (process.env.NODE_ENV === 'development') {
      return process.env.PK;
    }

    const k = await this.keyRepo.findOneBy({
      userId: userId,
    });
    if (k !== null) {
      return await this.reverseKey(k.walletPk);
    }
    return null;
  }

  async resetUserKey(userId: number): Promise<ResetUserKeyResult> {
    //This is a mocking pkid for development purpose only
    if (process.env.NODE_ENV === 'development') {
      return {
        oldKey: process.env.PK,
        newKey: process.env.PK,
      };
    }
    const newKey = Keypair.generate();
    const k = await this.keyRepo.findOneBy({
      userId: userId,
    });

    await this.keyRepo
      .createQueryBuilder()
      .update(Key)
      .set({ walletPk: this.encryptData(base58.encode(newKey.secretKey).toString(), randomBytes(16)), walletAddress: newKey.publicKey.toBase58() })
      .where('id = :id', { id: k.id })
      .execute();

    return {
      oldKey: await this.reverseKey(k.walletPk),
      newKey: base58.encode(newKey.secretKey).toString(),
    };
  }

  async createUserKey(userId: number, pkey: string): Promise<number> {
    if (process.env.NODE_ENV == 'development') {
      return -1;
    }

    const existingRecord = await this.keyRepo.findOneBy({ userId });

    if (existingRecord) {
      await this.keyRepo
        .createQueryBuilder()
        .update(Key)
        .set({ walletPk: this.encryptData(pkey, randomBytes(16)) })
        .where('id = :id', { id: existingRecord.id });
      return existingRecord.id;
    } else {
      const tx = await this.keyRepo.create({
        userId,
        walletPk: this.encryptData(pkey, randomBytes(16)),
      });
      const res = await this.keyRepo.save(tx);
      return res.id;
    }
  }
}
