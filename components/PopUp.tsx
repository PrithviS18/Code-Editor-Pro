'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import Axios from '@/lib/axios';
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { toast } from 'react-toastify';
import Script from 'next/script';

const PopUp = () => {
  const session = useSession();
  
  const handlePayment = async () => {
    const response = await Axios.post('/payment/order');
    const {order} = response.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: order.amount,
      currency: order.currency,
      name: 'CodeEditor Pro',
      description: 'Premium Subscription',
      order_id: order.id,
      handler:async function (response: any){
        try{
          const res = await Axios.post('/payment/verify',{
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          toast.success(res.data.message);
        }catch(error){
          toast.error("Payment verification failed")
        }
      },
      theme: {
        color: '#000000'
      },   
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className='p-0 rounded-full cursor-pointer h-12 w-12 border-black'>
            <Avatar className='w-full h-full'>
              <AvatarImage src={session.data?.user?.image} />
              <AvatarFallback className='text-black'>{session.data?.user?.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle className='font-semibold font-sans text-md text-center'>{session.data?.user?.name}</PopoverTitle>
            {session.data?.user?.subscription ? <></> : (<PopoverDescription className='my-2'><Button className='w-full bg-black text-white' onClick={handlePayment} >Buy Premium   ₹10 </Button></PopoverDescription>)}
            <PopoverDescription><Button className='w-full bg-red-600' onClick={() => signOut()}>Logout</Button></PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PopUp
