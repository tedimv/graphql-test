import { Entity, Property, OneToMany, PrimaryKey, Collection } from '@mikro-orm/core';
import { Contact } from './contact';


@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'varchar', length: 30 })
  name!: string;

  @OneToMany(() => Contact, contact => contact.user)
  contacts = new Collection<Contact>(this);
}