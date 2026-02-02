import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import ProjectModel from "@/models/Project";
import starterCode from "@/lib/starterCode";


export async function POST (req: Request){
    const session = await getServerSession(authOptions);

    if (!session?.user?.id){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const {name, language} = await req.json();

    try{
       const userId = new mongoose.Types.ObjectId(session.user.id);

       await connectDB();
       const project = new ProjectModel({
        userId,
        name,
        language,
        code: starterCode[language],
       })


       await project.save();

       return NextResponse.json({message: "Project Created Successfully", project}, {status: 201});
    }catch(error){
        return NextResponse.json({messsage: "Internal Server Error"} , {status: 500});
    }
}