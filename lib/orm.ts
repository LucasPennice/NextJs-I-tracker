// lib/orm.ts
import "../envConfig";
import { MikroORM } from "@mikro-orm/core";
import config from "../config/mikro-orm";

let _orm: MikroORM;

export async function getORM(): Promise<MikroORM> {
  if (_orm) return _orm;

  _orm = await MikroORM.init(config);
  return _orm;
}

export async function getEM() {
  const orm = await getORM();
  return orm.em.fork();
}
