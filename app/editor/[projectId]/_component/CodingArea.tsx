import React from 'react'
import Editor from '@monaco-editor/react'

interface Props {
    language: string;
    code: string;
    setCode: (code: string) => void;
}

const CodingArea = ({ language, code, setCode }: Props) => {
    console.log(code);
    return (
        <Editor
            language={language}
            value={code}
            height={"55vh"}
            onChange={(e) => setCode(e || "")}
            theme='vs-dark'
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
            }}
        />
    )
}

export default CodingArea
