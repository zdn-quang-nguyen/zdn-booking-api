import { MigrationInterface, QueryRunner } from "typeorm";

export class Backup1719372817776 implements MigrationInterface {
    name = 'Backup1719372817776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "address_detail"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "address_detail" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "address_detail"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "address_detail" character varying(64) NOT NULL`);
    }

}
