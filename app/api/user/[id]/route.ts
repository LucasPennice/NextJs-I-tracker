// app/api/user/[id]/route.ts
import { getEM } from "@/lib/orm";
import { User } from "@/entities/user.entity";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const em = await getEM();

  try {
    const asyncParams = await params;

    const user = await em.findOne(User, { _id: asyncParams.id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
