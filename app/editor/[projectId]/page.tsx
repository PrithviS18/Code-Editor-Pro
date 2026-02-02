"use client"
import React, { useEffect } from 'react'
import EditorHeader from './_component/EditorHeader'
import { useParams } from 'next/navigation';

interface Project {
  _id: string;
  name: string;
  language: string;
  code: string;
}


const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className='w-full'>
      <EditorHeader />

      Code Area
    </div>
  )
}

export default EditorPage
