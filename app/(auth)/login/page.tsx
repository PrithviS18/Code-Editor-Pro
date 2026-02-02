"use client"
import React, { useState } from 'react'
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import Link from 'next/link';
import {signIn} from "next-auth/react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@#$%^&*]/, "Password must contain at least one special character (@#$%^&*)"),
})

const loginPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  /*Defining form */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    setIsLoading(false);
    if (response?.error){
      toast.error(response.error);
    }else {
      toast.success("Logged in successfully!");
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-primary">
      <div className="flex justify-center items-center gap-3">
        <h1 className='text-3xl font-bold text-secondary'>Log In</h1>
        <Logo w={70} h={20}></Logo>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} value={field.value ?? ""}  disabled={isLoading}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} value={field.value ?? ""} disabled={isLoading} type='password'/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type='submit' className="cursor-pointer">
            {isLoading ? "Logging In..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="">
        <span className='text-secondary text-lg'>
          Do not have an account?
          <Link href="/register" className="text-blue-500 hover:underline p-3">Register</Link>
        </span>
      </div>
    </div>
  )
}

export default loginPage
