"use client"
import PopUp from '@/components/PopUp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'
import logo from '@/public/logo.svg'
import Logo from '@/components/Logo'
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { FaRegSave } from "react-icons/fa";
import { RiShareForwardFill } from "react-icons/ri";
import { VscRunAll } from "react-icons/vsc";

interface Props{
    name: string;
    setName: any ;
    runCode: any;
    running: boolean;
    saveProject: any;
    shareSnippet: any;
}


const EditorHeader = ({runCode, name, setName, running, saveProject , shareSnippet}: Props) => {

    const router = useRouter();
  return (
    <div className='w-full h-20 flex justify-between items-center p-4 shadow-md gap-3 '>
        <div className="flex justify-around items-center gap-1 w-lg">

            {/* Back Button */}
            <Button className='bg-secondary hover:bg-gray-400 cursor-pointer text-black' onClick={()=>router.back()}>
                <MdOutlineArrowBack style={{ width: "20px", height: "20px" }}/>
            </Button>

            {/* Project Name */}
            <Input placeholder='Enter Project Name' className='font-bold text-xl' value={name} onChange={(e)=>setName(e.target.value)}/>

            {/* Save Button */}
            <Button className='bg-secondary hover:bg-gray-400 cursor-pointer text-black' onClick={saveProject}>
                <FaRegSave style={{ width: "20px", height: "20px" }}/> 
            </Button>

            {/* Share Button */}
            <Button className='bg-secondary hover:bg-gray-400 cursor-pointer text-black' onClick={shareSnippet}>
                <RiShareForwardFill style={{ width: "30px", height: "30px" }} /> 
            </Button>
        </div>

        <div className="flex justify-center items-center w-xl">
            <Logo w={50} h={50}/>
        </div>

        <div className="flex justify-center gap-5 items-center w-60 ">

            {/* Execute Code */}
            <Button className='cursor-pointer' onClick={runCode}>
                {running? <span className='font-semibold text-lg'>Running...</span>:
                <>
                <VscRunAll style={{ width: "22px", height: "22px" }}/>
                <span className='font-semibold text-lg'>Run</span>
                </>
            }
            </Button>

            {/* Logout and Premium Pop up */}
            <PopUp/>
        </div>
    </div>
  )
}

export default EditorHeader
