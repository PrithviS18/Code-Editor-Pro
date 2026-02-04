import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import ProjectModel from "@/models/Project";

export async function POST(request: Request){
    try{
        const {_id,name,code} = await request.json();
        await connectDB();
        const res = await ProjectModel.updateOne({_id}, {$set: {name, code}});

        return NextResponse.json({res}, {status:200});
    }catch(error){
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}