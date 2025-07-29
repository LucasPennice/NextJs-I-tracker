import "../envConfig";
import { Meal } from "../entities/Meal";
import { User } from "../entities/User";
import { Options, defineConfig } from "@mikro-orm/mongodb";

const config: Options = defineConfig({
  clientUrl: process.env.MONGO_CONNECTION_URI,
  dbName: process.env.NODE_ENV === "development" ? "development" : "production",
  entities: [Meal, User],
  debug: true,
});

export default config;
