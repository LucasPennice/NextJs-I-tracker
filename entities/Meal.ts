import type { EntityDTO, Reference } from "@mikro-orm/core";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./User";

export type MealDataOnly = EntityDTO<Meal>;

@Entity()
export class Meal {
  @PrimaryKey({ type: "uuid" })
  _id = v4();

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: "string" })
  name: string;

  @Property({ type: "string" })
  imageUrl: string;

  @Property({ type: "number" })
  carbs: number;

  @Property({ type: "number" })
  insulin: number;

  @Property({ type: "string" })
  description: string;

  @ManyToOne({ entity: () => User })
  user!: Reference<User>;

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
      //@ts-expect-error que se yo
      userId: this.user.id,
    };
  }

  constructor(
    name: string,
    imageUrl: string,
    carbs: number,
    insulin: number,
    description: string,
    user: Reference<User>
  ) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.carbs = carbs;
    this.insulin = insulin;
    this.description = description;
    this.user = user;
  }
}
