// lib/orm.ts
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MikroORM, MongoDriver, Options } from "@mikro-orm/mongodb";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import "../envConfig";
import { Meal } from "@/entities/meal.entity";
import { User } from "@/entities/user.entity";

let _orm: MikroORM;

export const ormConfig: Options = {
  entities: [Meal, User],
  // metadataProvider: TsMorphMetadataProvider,
  dbName: process.env.NODE_ENV === "development" ? "development" : "production",
  // highlighter: new MongoHighlighter(),
  clientUrl: process.env.MONGO_CONNECTION_URI,
  // driver: MongoDriver,
  // dynamicImportProvider: (id) => import(id),
  // debug: true,
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
