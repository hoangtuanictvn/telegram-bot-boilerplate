import { AbstractEntity } from '../../common/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'keys' })
export class Key extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'wallet_pk', nullable: false })
  walletPk: string;

  @Column({ name: 'wallet_address', nullable: false })
  walletAddress: string;
}
