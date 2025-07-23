import type { Rel } from "@mikro-orm/core";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Meal extends BaseEntity {
  @Property()
  name: string;

  @Property()
  imageUrl: string;

  @Property()
  carbs: number;

  @Property()
  insulin: number;

  @Property()
  description: string;

  @ManyToOne({ entity: () => User })
  user!: Rel<User>;

  constructor(
    name: string,
    imageUrl: string,
    carbs: number,
    insulin: number,
    description: string,
    lastUpdate: Date,
    user: Rel<User>
  ) {
    super();
    this.name = name;
    this.imageUrl = imageUrl;
    this.carbs = carbs;
    this.insulin = insulin;
    this.description = description;
    this.user = user;
  }
}
