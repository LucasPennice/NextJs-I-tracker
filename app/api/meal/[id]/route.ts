import { getEM } from "@/lib/orm";
import { Meal } from "@/entities/meal.entity";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Meal;
    const em = await getEM();

    const asyncParams = await params;

    const meal = await em.findOne(Meal, { _id: asyncParams.id });

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

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
