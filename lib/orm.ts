// lib/orm.ts
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MikroORM, MongoDriver, Options } from "@mikro-orm/mongodb";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import "../envConfig";

let _orm: MikroORM;

export const ormConfig: Options = {
  entities: [], // ❗ debe estar vacío
  entitiesTs: ["./entities/**/*.entity.ts"],
  tsNode: true,
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new MongoHighlighter(),
  clientUrl: process.env.MONGO_CONNECTION_URI,
  driver: MongoDriver,
  debug: true,
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

async function testORM() {
  try {
    const orm = await MikroORM.init(ormConfig);
    console.log("✅ MikroORM initialized successfully");

    const em = orm.em.fork();
    const conn = await em.getConnection().isConnected();
    console.log("🔌 Database connection status:", conn);
  } catch (error) {
    console.error("❌ Failed to initialize MikroORM:", error);
  }
}

testORM();
