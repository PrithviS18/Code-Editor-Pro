import Image from 'next/image'
import logo from '@/public/logo.svg';

const Logo = ({w,h}: {w?: number, h?: number}) => {
  return (
    <div className='flex gap-2 items-center'>
      <Image src={logo} width={w??100} height={h??10} alt='Apna Editor'/>
      <span className='font-semibold text-lg text-blue-400 font-mono hidden md:block'>Code Editor Pro</span>
    </div>
  )
}

export default Logo
