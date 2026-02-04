import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import SnippetModel from "@/models/Snippet";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    console.log("yes")
    const { code, language, createdBy } = await request.json();

    await connectDB();

    const slug = crypto.randomBytes(4).toString("hex");
    console.log(slug);

    const snippet = await SnippetModel.create({
      slug,
      code,
      language,
      createdBy
    });

    return NextResponse.json(
      { slug: snippet.slug },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
