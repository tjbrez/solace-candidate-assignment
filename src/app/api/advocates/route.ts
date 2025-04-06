import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';

  const searchPattern = `%${searchTerm}%`;
  const data = await (searchTerm ? 
    db.select()
      .from(advocates)
      .where(
        sql`
          LOWER(first_name) LIKE ${searchPattern} OR 
          LOWER(last_name) LIKE ${searchPattern} OR 
          LOWER(city) LIKE ${searchPattern} OR 
          LOWER(degree) LIKE ${searchPattern} OR 
          years_of_experience::text LIKE ${searchPattern} OR 
          payload::text ILIKE ${searchPattern}
        `
      ) : 
    db.select().from(advocates)
  );

  return Response.json({ data });
}
