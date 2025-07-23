import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Meal } from "./meal.entity";

@Entity()
export class User extends BaseEntity {
  @OneToMany(() => Meal, (meal) => meal.user, {
    orphanRemoval: true,
  })
  meals = new Collection<Meal>(this);

  constructor() {
    super();
    this.meals = new Collection<Meal>(this);
  }
}
