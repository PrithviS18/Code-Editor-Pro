import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import connectDB from "@/config/connectDB";

export async function POST(request: NextRequest) {
    try {
        const {name, email, password} = await request.json();
        if (!name || !email || !password){
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await connectDB();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const user = new UserModel({ name, email, password, picture: "", subscription: false, refreshToken: "" });
        await user.save();
        return NextResponse.json({ message: "User created successfully"}, { status: 201 });


    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}