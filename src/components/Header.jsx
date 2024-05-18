import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <div className='shadow-sm border-b border-slate-500 sticky top-0 bg-slate-700 z-30 p-3'>
        <div className='flex justify-between items-center max-w-6xl mx-auto'>
        {/*logo*/}
        
        <Link href="/" className='hidden lg:inline-flex'>
            <Image
            src='/logo.png'
            width={96} 
            height={96} 
            alt='enduan max'
            />
        </Link>

        <Link href="/" className='lg:hidden inline-flex'>
            <Image
            src='/min-logo.png'
            width={40} 
            height={40} 
            alt='enduan max'
            />
        </Link>
        
        {/*search input*/}

        <input type="text" placeholder="Search" className='bg-slate-700 border-zinc-400 border-2 rounded text-sm w-full py-2 px-4 max-w-[210px] ' />

        {/*menu items*/}

        <button className='text-sm font-semibold text-blue-500'>Log In</button>
        </div>
    </div>
  )
}
