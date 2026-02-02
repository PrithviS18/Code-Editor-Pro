"use client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TypeAnimation } from 'react-type-animation';
import personcoding from '@/public/coding.png';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function Home() {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="min-h-screen bg-primary overflow-hidden flex flex-col justify-between">

      <header>
        <div className="flex items-center justify-between px-5 py-3 mx-auto">
          <Logo />
          <nav>
            <Button onClick={()=>{session.data?.user?.id ? router.push("/dashboard") : router.push("/login")}} className="bg-secondary text-black cursor-pointer hover:bg-gray-400">Login</Button>
          </nav>
        </div>
      </header>

      <div className="">
        <div className="flex justify-center text-secondary font-bold mx-auto text-center">
          <TypeAnimation sequence={['Write Your Own Code...', 1000, '', 500,]} wrapper="span" speed={50} repeat={Infinity} cursor={true} style={{ fontSize: '5em' }} />
        </div>
        <div className="flex justify-center">
          <Image src={personcoding} width={400} height={200} alt="Coding Space Image" />
        </div>
      </div>

      <footer className="bg-black text-center p-2">
        <span className="text-secondary font-semibold ">
          @Made by Prithvi (Devine)
        </span>
      </footer>
    </div>
  );
}
