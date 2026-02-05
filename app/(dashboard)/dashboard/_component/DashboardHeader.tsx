'use client'
import Logo from '@/components/Logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import React from 'react'
import { signOut } from 'next-auth/react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import PopUp from '@/components/PopUp'

const DashboardHeader = () => {
  const session = useSession();
  console.log(session);
  return (
    <div className='w-full  bg-white  h-16 flex items-center px-4 shadow-sm'>

      <div className='md:hidden'>
        <Logo w={50} h={40} />
      </div>


      <div className="hidden md:block">
        <span className='font-semibold'>Hi Welcome {session.data?.user?.name?.split(' ')[0] || 'User'} !!!</span>
      </div>

      <div className="ml-auto hidden md:block">
        <PopUp/>
      </div>

      <div className="md:hidden ml-auto">
          <SidebarTrigger />
      </div>
    </div>
  )
}

export default DashboardHeader
