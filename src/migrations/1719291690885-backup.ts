import { MigrationInterface, QueryRunner } from "typeorm";

export class Backup1719291690885 implements MigrationInterface {
    name = 'Backup1719291690885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "sport_field_id" uuid NOT NULL, "province_id" text NOT NULL, "district_id" text NOT NULL, "ward_id" text NOT NULL, "address_detail" character varying(64) NOT NULL, "longitude" double precision NOT NULL, "latitude" double precision NOT NULL, CONSTRAINT "REL_d660228fbab0a89c34142571c7" UNIQUE ("sport_field_id"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_d660228fbab0a89c34142571c70" FOREIGN KEY ("sport_field_id") REFERENCES "sport_field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_0ac57807335024412ea1eaeebf2" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_828664dee332d2dc0499a1bd5e2" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_6047e430274bb345b9437cb937c" FOREIGN KEY ("ward_id") REFERENCES "ward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_6047e430274bb345b9437cb937c"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_828664dee332d2dc0499a1bd5e2"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_0ac57807335024412ea1eaeebf2"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_d660228fbab0a89c34142571c70"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
