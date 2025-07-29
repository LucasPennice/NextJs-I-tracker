import "reflect-metadata";
import { getEM } from "../../../../lib/orm";
import { Meal } from "../../../../entities/Meal";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Meal;
    const em = await getEM();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const meal = await em.findOne(Meal, { _id: id });

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    console.log(meal, body);

    // Update fields if provided
    if (body.name !== undefined) meal.name = body.name;
    if (body.carbs !== undefined) meal.carbs = body.carbs;
    if (body.insulin !== undefined) meal.insulin = body.insulin;
    if (body.description !== undefined) meal.description = body.description;
    if (body.imageUrl !== undefined) meal.imageUrl = body.imageUrl;
    body.updatedAt = new Date();

    await em.persistAndFlush(meal);

    return NextResponse.json(meal.toJSON(), { status: 200 });
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: "Failed to update meal" },
      { status: 500 }
    );
  }
}
