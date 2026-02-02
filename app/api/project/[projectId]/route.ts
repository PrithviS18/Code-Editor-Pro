import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ProjectModel from "@/models/Project";
import mongoose from "mongoose";

interface Params {
    params: {
        projectId: string,
    };
}

export async function GET(request: Request,context: { params: Promise<{projectId: string}> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    try {
        const { projectId } = await context.params;

        await connectDB();

        const project = await ProjectModel.findById({
            _id: new mongoose.Types.ObjectId(projectId),
        });

        if (!project){
            return NextResponse.json({message: "Project Not found"}, {status:404});
        }

        return NextResponse.json({project});

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}