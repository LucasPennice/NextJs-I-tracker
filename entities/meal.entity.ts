import * as core from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";

@core.Entity()
export class Meal {
  @core.PrimaryKey({ type: "uuid" })
  _id: string;

  @core.Property()
  name: string;

  @core.Property()
  imageUrl: string;

  @core.Property()
  carbs: number;

  @core.Property()
  insulin: number;

  @core.Property()
  description: string;

  @core.Property()
  lastUpdate: Date;

  @core.ManyToOne({ entity: () => User })
  user!: core.Rel<User>;

  constructor(
    name: string,
    imageUrl: string,
    carbs: number,
    insulin: number,
    description: string,
    lastUpdate: Date,
    user: core.Rel<User>
  ) {
    this._id = v4();
    this.name = name;
    this.imageUrl = imageUrl;
    this.carbs = carbs;
    this.insulin = insulin;
    this.description = description;
    this.lastUpdate = lastUpdate;
    this.user = user;
  }
}
