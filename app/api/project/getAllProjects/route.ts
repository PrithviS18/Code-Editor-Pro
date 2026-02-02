import { connection, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ProjectModel from "@/models/Project";
import mongoose from "mongoose";

export async function GET () {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    try{
        await connectDB();
        const userId = new mongoose.Types.ObjectId( session.user.id);
        const projects = await ProjectModel.find({userId}).sort({updatedAt:-1}).select("_id name language updatedAt createdAt");

        return NextResponse.json(projects, {status: 200});
    }catch(error){
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}