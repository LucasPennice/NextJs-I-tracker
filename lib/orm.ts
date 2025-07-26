// lib/orm.ts
import { Meal } from "@/entities/meal.entity";
import { User } from "@/entities/user.entity";
import { MikroORM, Options } from "@mikro-orm/mongodb";
import "../envConfig";

let _orm: MikroORM;

export const ormConfig: Options = {
  entities: [Meal, User],
  dbName: process.env.NODE_ENV === "development" ? "development" : "production",
  clientUrl: process.env.MONGO_CONNECTION_URI,
};

export async function getORM(): Promise<MikroORM> {
  if (_orm) return _orm;

  _orm = await MikroORM.init(ormConfig);
  return _orm;
}

export async function getEM() {
  const orm = await getORM();
  return orm.em.fork(); // importante: fork para evitar estado compartido
}
