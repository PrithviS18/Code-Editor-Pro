import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import connectDB from '@/config/connectDB';
import UserModel from '@/models/User';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);


    if (!session?.user?.id){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY || '')
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generated_signature !== razorpay_signature) {
        return NextResponse.json({message: "Invalid signature"}, {status: 400});
    }

    //payment is verified, update user's subscription status in DB
    try{
        await connectDB();

        await UserModel.findByIdAndUpdate(session.user.id, {subscription: true});

        return NextResponse.json({message: "Payment verified. Please Login Again to Enjoy Subscription"}, {status: 200})
    }catch(error){
        return NextResponse.json({message: "Internal Server Error"}, {status: 500})
    }

}