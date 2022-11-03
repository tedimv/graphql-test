import { PrimaryKey, Entity, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user';

@Entity()
export class Contact {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 30, nullable: true })
  email!: string;

  @Property({ nullable: true })
  phone!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User;
}