import { getEM } from "@/lib/orm";
import { User } from "@/entities/user.entity";
import { Meal } from "@/entities/meal.entity";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const asyncParams = await params;

    const em = await getEM();
    const user = await em.findOne(User, { _id: asyncParams.id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMeal = new Meal(
      body.name,
      body.imageUrl,
      body.carbs,
      body.insulin,
      body.description,
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
