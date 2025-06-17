import { NextResponse } from "next/server";
import { client } from "@/lib/mongo_db";

export async function GET() {
  try {
    await client.connect();
    const db = client.db("sample_analytics");
    const customersCollection = db.collection("customers");

    const users = await customersCollection
      .find({})
      .project({ username: 1, _id: 0 })
      .toArray();

    const usernames = users.map((user) => user.username);

    return NextResponse.json(usernames);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch usernames" },
      { status: 500 },
    );
  }
}