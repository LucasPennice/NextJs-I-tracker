import { NextResponse } from "next/server";
import { getEM } from "@/lib/orm";
import { User } from "@/entities/user.entity";
import { wrap } from "@mikro-orm/core";

export async function POST() {
  try {
    const em = await getEM();

    const newUser = new User();

    await em.persistAndFlush(newUser);

    return NextResponse.json(newUser.toJSON(), { status: 200 });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
