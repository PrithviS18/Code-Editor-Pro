"use client";

import Logo from "@/components/Logo";
import Editor from "@monaco-editor/react";
import Link from "next/link";

interface Snippet {
  code: string;
  language: string;
  createdBy: string;
}

export default function SnippetClient({ snippet }: { snippet: Snippet }) {

  return (
    <>
      <div className="h-[10vh] p-3 flex items-center justify-between">
        <Link href={'/'}>
          <Logo w={50} h={50} />
        </Link>
        <span className=" text-lg font-serif flex gap-2">Project CreatedBy:      
          <span className="text-blue-600 font-semibold text-lg">
             {snippet.createdBy}
          </span>
        </span>
      </div>
      <Editor
        height="90vh"
        language={snippet.language}
        value={snippet.code}
        theme="vs-dark"
        options={{ readOnly: true }}
      />
    </>
  );
}
