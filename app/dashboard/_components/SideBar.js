import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdf from './UploadPdf'

const SideBar = () => {
  return (
    <div className='shadow-md h-screen p-4'>
      <Image src={'/logo.svg'} alt='logo' width={100} height={80}/>
    
      <div className='mt-10'>
      
        <UploadPdf>
          <Button className="w-full">+ Upload Pdf</Button>
        </UploadPdf>
        <div className='flex items-center gap-2 p-3 mt-4 hover:bg-slate-100 rounded-lg cursor-pointer'>
            <Layout/>
            <h2>Workspace</h2>
        </div>

        <div className='flex items-center gap-2 p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer'>
            <Shield/>
            <h2>Upgrade</h2>
        </div>
        <div className='absolute bottom-24 w-[80%]'>
          <Progress value={33} />
          <p className='mt-2 text-sm'>2 out of 5 Pdf uploaded</p>
          <p className='mt-3 text-gray-600 text-sm'>Upgrade to upload more </p>
        </div>
      </div>
    </div>
  )
}

export default SideBar