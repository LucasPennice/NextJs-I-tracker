import {
  Collection,
  Entity,
  EntityDTO,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Meal, MealDataOnly } from "./meal.entity";

export type InsulinSensitivityEntry = {
  date: Date;
  value: number;
};

export type UserDataOnly = Omit<EntityDTO<User>, "meals"> & {
  meals: MealDataOnly[];
};

@Entity()
export class User extends BaseEntity {
  @OneToMany(() => Meal, (meal) => meal.user, {
    orphanRemoval: true,
  })
  meals = new Collection<Meal>(this);

  @Property({ type: "json" })
  historialInsulinSensitivity: InsulinSensitivityEntry[] = [
    { value: 11, date: new Date() },
  ];

  @Property()
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
    super();
    this.meals = new Collection<Meal>(this);
    this.insulinSensitivity = 11;
  }
}
