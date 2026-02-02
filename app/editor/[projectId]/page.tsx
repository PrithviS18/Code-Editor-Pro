"use client"
import React, { useEffect, useState } from 'react'
import EditorHeader from './_component/EditorHeader'
import { useParams } from 'next/navigation';
import CodingArea from './_component/CodingArea';
import InputArea from './_component/InputArea';
import OutputArea from './_component/OutputArea';
import Axios from '@/lib/axios';

interface Project {
  _id: string;
  name: string;
  language: string;
  code: string;
}


const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [code,setCode] = useState<string>("");
  const [project, setProject] = useState <Project | null> (null);
  const [input,setInput] = useState<string> ("");
  const [output,setOutput] = useState<string> ("");

  useEffect (()=>{
    const getProject = async() => {
      try{
        
        const response =await Axios.get(`/project/${projectId}`);
        setProject(response.data.project)
        setCode(response.data.project.code)
      }catch(error: any){
        console.log(error);
      }
    }

    getProject();
  },[projectId])


  return (
    <div className='w-full'>
      <EditorHeader />

      <div className="w-full flex flex-col justify-center items-center gap-4">
        <div className="w-full m-1">
          <CodingArea language={project?.language || ""} code={project?.code||""} setCode={setCode}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full p-2 gap-2">
          <InputArea input={input} setInput={setInput}/>

          <OutputArea output={output}/>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
