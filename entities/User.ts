import {
  Collection,
  Entity,
  EntityDTO,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Meal, MealDataOnly } from "./Meal";
import { v4 } from "uuid";

export type InsulinSensitivityEntry = {
  date: Date;
  value: number;
};

export type UserDataOnly = Omit<EntityDTO<User>, "meals"> & {
  meals: MealDataOnly[];
};

@Entity()
export class User {
  @PrimaryKey({ type: "uuid" })
  _id = v4();

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Meal, (meal) => meal.user, {
    orphanRemoval: true,
  })
  meals = new Collection<Meal>(this);

  @Property({ type: "json" })
  historialInsulinSensitivity: InsulinSensitivityEntry[] = [
    { value: 11, date: new Date() },
  ];

  @Property({ type: "number" })
  insulinSensitivity: number;

  toJSON() {
    return {
      _id: this._id,
      historialInsulinSensitivity: this.historialInsulinSensitivity,
      meals: this.meals.getItems().map((meal) => meal.toJSON?.() ?? meal),
      insulinSensitivity: this.insulinSensitivity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  constructor() {
    this.insulinSensitivity = 11;
  }
}
