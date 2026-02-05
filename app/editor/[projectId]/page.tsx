"use client"
import React, { useEffect, useState } from 'react'
import EditorHeader from './_component/EditorHeader'
import { useParams, useRouter } from 'next/navigation';
import CodingArea from './_component/CodingArea';
import InputArea from './_component/InputArea';
import OutputArea from './_component/OutputArea';
import Axios from '@/lib/axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

interface Project {
  _id: string;
  name: string;
  language: string;
  code: string;
}


const EditorPage = () => {

  const session = useSession();
  const router = useRouter();

  if (!session){
    router.push('/login');
  }

  const { projectId } = useParams<{ projectId: string }>();
  const [code, setCode] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [saving, setSaving] = useState<string>("");

  useEffect(() => {
    const getProject = async () => {
      try {

        const response = await Axios.get(`/api/project/${projectId}`);
        setProject(response.data.project)
        setCode(response.data.project.code)
        setName(response.data.project.name)
      } catch (error: any) {
        console.log(error);
      }
    }

    getProject();
  }, [projectId])

  const runCode = async () => {
    try {
      if (!project) {
        return;
      }

      setRunning(true);
      setOutput("");

      const response = await Axios.post('/api/project/execute', {
        code,
        language: project.language,
        input,
      })

      console.log(response);
      if (response.data.compileError) {
        setOutput(response.data.compileError);
      }
      else if (response.data.error) {
        setOutput(response.data.error);
      }
      else {
        setOutput(response.data.output || "No output");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setRunning(false);
    }
  }

  const saveProject = async () => {
    try {
      const response = await Axios.post('/api/project/saveProject', { _id: project?._id, name, code });

      if (response.status === 200) {
        toast.success("Code Saved Successfully!!")
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const shareSnippet = async () => {
    try{
      if (!project) {
        toast.error("Project not loaded");
        return;
      }

      const res = await Axios.post("/api/snippet", {
        code,
        language: project.language,
        createdBy: name,
      });
      
      const url = `${window.location.origin}/snippet/${res.data.slug}`;
      console.log(res);
      navigator.clipboard.writeText(url);
      
      toast.success("Share Link Copied")
    }catch(error: any){
      console.log(error);
    }
  }

  return (
    <div className='w-full'>
      <EditorHeader runCode={runCode} name={name} setName={setName} 
       running={running} saveProject={saveProject}  shareSnippet={shareSnippet}/>

      <div className="w-full flex flex-col justify-center items-center gap-4">
        <div className="w-full m-1">
          <CodingArea language={project?.language || ""} code={project?.code || ""} setCode={setCode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full p-2 gap-2">
          <InputArea input={input} setInput={setInput} />

          <OutputArea output={output} />
        </div>
      </div>
    </div>
  )
}

export default EditorPage
