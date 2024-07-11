import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotification1720408518049 implements MigrationInterface {
    name = 'AddNotification1720408518049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "isRead" TO "is_read"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "is_read" TO "isRead"`);
    }

}
