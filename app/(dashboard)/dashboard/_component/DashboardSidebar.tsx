"use client"
import Logo from '@/components/Logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CreateProject from './CreateProject'
import PopUp from '@/components/PopUp'
import Axios from '@/lib/axios'
import cpp from "@/public/cpp.png";
import java from "@/public/java.png";
import python from "@/public/python.png";
import javascript from "@/public/javascript.png";
import kotlin from "@/public/kotlin.png";
import go from "@/public/go.png";
import Image from 'next/image'

interface Project {
    _id: string;
    name: string;
    language: string;
    updatedAt: string;
    createdAt: string;
}

const DashboardSidebar = () => {
    const pathname = usePathname();
    const session = useSession();

    const [projects, setProjects] = useState<Project[]>([]);
    const lang: { [key: string]: any } = {
        "cpp":cpp,
        "java":java,
        "javascript":javascript,
        "python": python,
        "kotlin" : kotlin,
        "go": go
    }

    useEffect(() => {
        console.log("yes")
        const getAllProjects = async () => {
            try {
                const response = await Axios.get("/api/project/getAllProjects");


                if (response.status === 200) {
                    const data = response.data;
                    setProjects(Array.isArray(data) ? data : Object.values(data));
                }
            } catch (error) {
                console.log(error);
                setProjects([]);
            }
        };

        getAllProjects();
    }, []);
    return (
        <Sidebar className='overflow-hidden'>
            <SidebarHeader className='px-4'>
                <Logo w={50} h={40} />
            </SidebarHeader>
            {/* <SidebarSeparator /> */}
            <SidebarContent>
                <CreateProject/>
                <div className="px-2 w-full">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href={'/dashboard'} className={cn('min-w-full w-full block px-4 py-1 rounded-md', pathname === '/dashboard' && 'bg-secondary')} >
                                Dashboard
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarGroup>
                        <SidebarGroupLabel>Recent Codes</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {projects.slice(0,5).map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <Link href={`/editor/${item._id}`} className='my-2 shadow-sm'>
                                                <Image src={lang[item.language]} alt={item.language} className="w-14 h-14 p-4"/>
                                                <span className='font-semibold'>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <div className=" w-full md:hidden">
                    <PopUp/>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar
