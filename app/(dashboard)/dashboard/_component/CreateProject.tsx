"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import Axios from '@/lib/axios'
import { isAxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const CreateProject = () => {
    const [projectName, setProjectName] = useState<string>('');
    const [language, setLanguage] = useState<string>('cpp');
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const session = useSession();
    const router = useRouter();

    const handleCreateProject = async (e: any) => {
        e.preventDefault();
        if (!projectName) {
            toast.error("Project name is required");
            return;
        }
        setIsLoading(true);

        try {
            const response = await Axios.post('/project/createProject', {
                name: projectName,
                language: language
            })
            if (response.status === 201) {
                setOpen(false);
                setProjectName('');
                setLanguage('cpp');
                router.push(`/editor/${response.data.project._id}`)
                
            }
            console.log(response);
        } catch (error: any) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
            
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'default'} className='cursor-pointer my-4 mx-2 bg-blue-400'>Create Project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='w-full text-center'>Create Project</DialogTitle>
                    <form >
                        <Input className='my-4' value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder='Enter Project Name' />
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button disabled={isLoading} variant="outline" className='w-full'>Choose Language</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuGroup>
                                    <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                        <DropdownMenuRadioItem value="cpp">C++</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="python">Python</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="javascript">JavaScript</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="java">Java</DropdownMenuRadioItem>

                                        {session.data?.user?.subscription ?
                                            <>
                                                <DropdownMenuRadioItem value="kotlin">Kotlin</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="go">Go</DropdownMenuRadioItem>
                                            </> :
                                            <DropdownMenuLabel>Buy Premium to Unlock More Languages</DropdownMenuLabel>
                                        }
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button disabled={isLoading} className='cursor-pointer my-4 w-full bg-blue-400' onClick={handleCreateProject}>{isLoading ? "Creating..." : "Create Project"}</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProject
