import React from 'react'

interface Props {
    input: string;
    setInput: (input: string)=> void;
}

const InputArea = ({input, setInput} : Props) => {
  return (
    <div className=''>
      <textarea placeholder='Enter Your Input Here'
      value={input}
      onChange={(e)=>setInput(e.target.value)}
      className='w-full h-44 resize-none bg-gray-900 text-white overflow-auto p-4'/>
    </div>
  )
}

export default InputArea
