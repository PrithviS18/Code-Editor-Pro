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
import Axios from '@/lib/axios';
import { Bounce, toast } from 'react-toastify'
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@#$%^&*]/, "Password must contain at least one special character (@#$%^&*)"),
  confirmPassword: z.string({ message: "Please confirm your password" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const registerPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  /*Defining form */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const response = await Axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      })

      if (response.status === 201) {
        toast.success("Account created successfully! Please login.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        form.reset();
        router.push('/login');
      }
      
    } catch (error : any) {
      toast.error(error?.response?.data?.message || error?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-primary">
      <div className="flex justify-center items-center gap-3">
        <h1 className='text-3xl font-bold text-secondary'>Create Account</h1>
        <Logo w={70} h={20}></Logo>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} value={field.value ?? ""} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} value={field.value ?? ""} disabled={isLoading} />
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
                  <Input placeholder="Enter your password" {...field} value={field.value ?? ""} disabled={isLoading} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm your password" {...field} value={field.value ?? ""} disabled={isLoading} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type='submit' className="cursor-pointer">
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </form>
      </Form>

      <div className="">
        <span className='text-secondary text-lg'>
          Already have an account?
          <Link href="/login" className="text-blue-500 hover:underline p-3">Login</Link>
        </span>
      </div>
    </div>
  )
}

export default registerPage
