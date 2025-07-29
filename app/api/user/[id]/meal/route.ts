import "reflect-metadata";
import { getEM } from "../../../../../lib/orm";
import { User } from "../../../../../entities/User";
import { Meal } from "../../../../../entities/Meal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const em = await getEM();
    const user = await em.findOne(User, { _id: id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMeal = new Meal(
      body.name,
      body.imageUrl,
      body.carbs,
      body.insulin,
      body.description,
      // @ts-expect-error te juro
      user
    );

    await em.persistAndFlush(newMeal);

    return NextResponse.json(newMeal.toJSON(), { status: 200 });
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { error: "Failed to create meal" },
      { status: 500 }
    );
  }
}
