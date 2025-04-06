import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
  }

  const queryClient = postgres(process.env.DATABASE_URL ?? '');
  return drizzle(queryClient, { schema });
};

export default setup();