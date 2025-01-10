import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-end p-5 shadow-sm'>
      <UserButton/>
      
    </div>
  )
}

export default Header