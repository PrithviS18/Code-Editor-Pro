"use client";

import Editor from "@monaco-editor/react";

interface Snippet {
  code: string;
  language: string;
}

export default function SnippetClient({ snippet }: { snippet: Snippet }) {
  return (
    <Editor
      height="100vh"
      language={snippet.language}
      value={snippet.code}
      theme="vs-dark"
      options={{ readOnly: true }}
    />
  );
}
