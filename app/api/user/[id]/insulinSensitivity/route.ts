import { User } from "@/entities/user.entity";
import { getEM } from "@/lib/orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const asyncParams = await params;

    const em = await getEM();
    const user = await em.findOne(
      User,
      { _id: asyncParams.id },
      { populate: ["meals"] }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      !body.historialInsulinSensitivity ||
      !Array.isArray(body.historialInsulinSensitivity) ||
      !body.insulinSensitivity
    ) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    user.historialInsulinSensitivity = body.historialInsulinSensitivity;
    user.insulinSensitivity = body.insulinSensitivity;

    await em.persistAndFlush(user);

    return NextResponse.json(user.toJSON(), { status: 200 });
  } catch (error) {
    console.error("Error updating insuline sensitivity:", error);
    return NextResponse.json(
      { error: "Failed to update insuline sensitivity" },
      { status: 500 }
    );
  }
}
