import { MigrationInterface, QueryRunner } from 'typeorm';

export class Backup1720325277011 implements MigrationInterface {
  name = 'Backup1720325277011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."account_name_enum" AS ENUM('manual', 'is_google', 'is_facebook')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" "public"."account_name_enum" NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "district" ("id" text NOT NULL, "name" text NOT NULL, "province_id" text NOT NULL, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("id" text NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ward" ("id" text NOT NULL, "name" text NOT NULL, "district_id" text NOT NULL, CONSTRAINT "PK_e6725fa4a50e449c4352d2230e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "sport_field_id" uuid NOT NULL, "province_id" text NOT NULL, "district_id" text NOT NULL, "ward_id" text NOT NULL, "address_detail" character varying(255) NOT NULL, "longitude" double precision, "latitude" double precision, CONSTRAINT "REL_d660228fbab0a89c34142571c7" UNIQUE ("sport_field_id"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_field_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" character varying(255) NOT NULL, "url" character varying NOT NULL, "sport_field_id" uuid NOT NULL, CONSTRAINT "PK_d9081af097ac7f0c7947f9db1dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_field_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" character varying NOT NULL, CONSTRAINT "PK_8abff8590d54bc404704387161d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport_field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" character varying(255) NOT NULL, "quantity" integer NOT NULL, "phone" character varying(11) NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "price" double precision NOT NULL, "rule" character varying(65535) NOT NULL, "sport_field_type_id" uuid NOT NULL, "owner_id" uuid NOT NULL, CONSTRAINT "PK_82825bd3d86802e2df3ae4c32fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" character varying(255) NOT NULL, "sport_field_id" uuid NOT NULL, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."booking_status_enum" AS ENUM('disabled', 'rejected', 'available', 'accepted', 'booking')`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "phone" character varying(10), "full_name" character varying(52) NOT NULL, "field_id" uuid NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "amount" double precision NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'booking', CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'owner')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid NOT NULL, "updated_by" uuid, "deleted_by" uuid, "name" character varying(52) NOT NULL, "email" character varying(320) NOT NULL, "phone" character varying(10), "role" "public"."user_role_enum" NOT NULL, "image_url" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_d660228fbab0a89c34142571c70" FOREIGN KEY ("sport_field_id") REFERENCES "sport_field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_0ac57807335024412ea1eaeebf2" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_828664dee332d2dc0499a1bd5e2" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_6047e430274bb345b9437cb937c" FOREIGN KEY ("ward_id") REFERENCES "ward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" ADD CONSTRAINT "FK_87b790786a0bdc1217030c3147a" FOREIGN KEY ("sport_field_id") REFERENCES "sport_field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ADD CONSTRAINT "FK_51becccfe64f01ca80032ec043a" FOREIGN KEY ("sport_field_type_id") REFERENCES "sport_field_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ADD CONSTRAINT "FK_b6fb75537fba43c4922bf5c7d8e" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "field" ADD CONSTRAINT "FK_5b6290b077f8ae85494f17e9279" FOREIGN KEY ("sport_field_id") REFERENCES "sport_field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_3332ea09557d88e289953278875" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_3332ea09557d88e289953278875"`,
    );
    await queryRunner.query(
      `ALTER TABLE "field" DROP CONSTRAINT "FK_5b6290b077f8ae85494f17e9279"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" DROP CONSTRAINT "FK_b6fb75537fba43c4922bf5c7d8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" DROP CONSTRAINT "FK_51becccfe64f01ca80032ec043a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" DROP CONSTRAINT "FK_87b790786a0bdc1217030c3147a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_6047e430274bb345b9437cb937c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_828664dee332d2dc0499a1bd5e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_0ac57807335024412ea1eaeebf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_d660228fbab0a89c34142571c70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    await queryRunner.query(`DROP TABLE "field"`);
    await queryRunner.query(`DROP TABLE "sport_field"`);
    await queryRunner.query(`DROP TABLE "sport_field_type"`);
    await queryRunner.query(`DROP TABLE "sport_field_image"`);
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "ward"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP TABLE "district"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TYPE "public"."account_name_enum"`);
  }
}
