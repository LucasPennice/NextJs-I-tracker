// app/api/user/[id]/route.ts
import { getEM } from "@/lib/orm";
import { User } from "@/entities/user.entity";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const em = await getEM();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const user = await em.findOne(User, { _id: id }, { populate: ["meals"] });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.toJSON(), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
