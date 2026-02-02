import React from 'react'

interface Props{
    output: string;
}

const OutputArea = ({output}: Props) => {
  return (
    <div className='w-full h-44 resize-none bg-gray-900 text-white overflow-auto p-4'>
      {output}
    </div>
  )
}

export default OutputArea
