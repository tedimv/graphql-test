import { Migration } from '@mikro-orm/migrations';

export class Migration20221103210132 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "contact" drop constraint "contact_user_id_foreign";');

    this.addSql('alter table "contact" alter column "phone" type varchar(255) using ("phone"::varchar(255));');
    this.addSql('alter table "contact" alter column "phone" drop not null;');
    this.addSql('alter table "contact" alter column "user_id" type int using ("user_id"::int);');
    this.addSql('alter table "contact" alter column "user_id" drop not null;');
    this.addSql('alter table "contact" add constraint "contact_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contact" drop constraint "contact_user_id_foreign";');

    this.addSql('alter table "contact" alter column "phone" type varchar(255) using ("phone"::varchar(255));');
    this.addSql('alter table "contact" alter column "phone" set not null;');
    this.addSql('alter table "contact" alter column "user_id" type int using ("user_id"::int);');
    this.addSql('alter table "contact" alter column "user_id" set not null;');
    this.addSql('alter table "contact" add constraint "contact_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
