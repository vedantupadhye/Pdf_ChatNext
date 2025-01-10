import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const WorkspaceHeader = ({ fileName }) => {
  return (
    <div className='p-2 flex items-center justify-between shadow-md bg-white'>
      {/* Logo */}
      <div className="flex items-center">
        <Image src={'/logo.svg'} alt='logo' width={70} height={50} />
      </div>

      {/* File name */}
      <h2 className='py-2 font-semibold text-lg flex-1 text-center'>
        File name - <span className="text-blue-600">{fileName}</span>
      </h2>

      {/* User button */}
    
      {/* Dashboard button */}
      <Link href='/dashboard'>
        <Button className='ml-4 px-4 py-2 font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all'>
          Go to Dashboard
        </Button>
      </Link>

      <div className="flex items-center ml-10">
        <UserButton />
      </div>

    </div>
  )
}

export default WorkspaceHeader
