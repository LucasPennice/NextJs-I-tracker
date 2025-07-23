import * as core from "@mikro-orm/core";
import { v4 } from "uuid";
import { Meal } from "./meal.entity";

@core.Entity()
export class User {
  @core.PrimaryKey({ type: "uuid" })
  _id: string;

  @core.OneToMany(() => Meal, (meal) => meal.user, {
    orphanRemoval: true,
  })
  meals = new core.Collection<Meal>(this);

  constructor() {
    this._id = v4();
    this.meals = new core.Collection<Meal>(this);
  }
}
