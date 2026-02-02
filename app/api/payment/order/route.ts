import razorpay from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try{
        const order = await razorpay.orders.create({
            amount: 1000, 
            currency: "INR",
            receipt: `receipt_order_${Math.random()*1000}`,
        });

        return NextResponse.json({order}, {status:200});
    }catch(error){
        console.log("Error in creating order:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }
}