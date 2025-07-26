import type { EntityDTO, Rel } from "@mikro-orm/core";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

export type MealDataOnly = EntityDTO<Meal>;

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

  toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      imageUrl: this.imageUrl,
      carbs: this.carbs,
      insulin: this.insulin,
      description: this.description,
      userId: this.user?._id,
    };
  }

  constructor(
    name: string,
    imageUrl: string,
    carbs: number,
    insulin: number,
    description: string,
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
