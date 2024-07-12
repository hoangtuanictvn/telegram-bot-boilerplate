import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1720837011747 implements MigrationInterface {
    name = 'Generate1720837011747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "keys" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "wallet_pk" character varying NOT NULL, "wallet_address" character varying NOT NULL, CONSTRAINT "PK_e63d5d51e0192635ab79aa49644" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "keys"`);
    }

}
