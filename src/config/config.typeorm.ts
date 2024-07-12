import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import * as dotenv from 'dotenv';
// Load env
dotenv.config();

const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logger: 'file',
  logging: ['warn', 'error', 'query'],
};

export const connectionSource = new DataSource(dataSourceOptions as DataSourceOptions);

export const dbOrmModuleAsync = TypeOrmModule.forRootAsync({
  useFactory: () => dataSourceOptions as TypeOrmModuleOptions,
  dataSourceFactory: async options => {
    return addTransactionalDataSource(new DataSource(options));
  },
});
