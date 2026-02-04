import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import SnippetModel from "@/models/Snippet";

export async function GET(
    req: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {

        const { slug } = await context.params;

        await connectDB();

        const snippet = await SnippetModel.findOne({ slug });

        if (!snippet) {
            return NextResponse.json(
                { message: "Snippet not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ snippet });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
