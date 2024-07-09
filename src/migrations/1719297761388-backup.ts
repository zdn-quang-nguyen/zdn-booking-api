import { MigrationInterface, QueryRunner } from "typeorm";

export class Backup1719297761388 implements MigrationInterface {
    name = 'Backup1719297761388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" SET NOT NULL`);
    }

}
