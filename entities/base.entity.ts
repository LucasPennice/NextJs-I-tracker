import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: "createdAt" | "updatedAt" | Optional;

  @PrimaryKey()
  _id = v4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
