import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const WorkspaceHeader = ({fileName}) => {
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Image src={'/logo.svg'} alt='logo' width={140} height={100}/>
        <h2 className='py-2 font-semibold'>File name - {fileName}</h2>
        <UserButton />
    </div>
  )
}

export default WorkspaceHeader