import { Migration } from '@mikro-orm/migrations';

export class Migration20221103193351 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "name" varchar(30) not null);');

    this.addSql('create table "contact" ("id" serial primary key, "email" varchar(30) null, "phone" varchar(255) not null, "user_id" int not null);');

    this.addSql('alter table "contact" add constraint "contact_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contact" drop constraint "contact_user_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "contact" cascade;');
  }

}
