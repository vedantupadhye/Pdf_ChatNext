import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Layout, Shield, Video } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import UploadPdf from './UploadPdf';
import Link from 'next/link';

const SideBar = () => {
  return (
    <div className="shadow-md h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center sm:justify-start mb-20">
        <Link href={'/'}>
          <Image src={'/logo.svg'} alt="logo" width={60} height={50} />
        </Link>
      </div>
    
      {/* Main content */}
      <div className="flex-1">
        <UploadPdf>
          <Button className="w-full">+ Upload Pdf</Button>
        </UploadPdf>

        {/* Navigation items */}
        <div className="mt-10">
          <div className="flex items-center gap-2 p-3 mt-4 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Layout />
            <h2>Workspace</h2>
          </div>
          <div className="flex items-center gap-2 p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer">
            <Video />
            <Link href={'/learn-more'}>
            <h2>See Demo </h2>
            </Link>          
          </div>
        </div>
      </div>

      {/* Progress bar at the bottom */}
      {/* <div className="w-full px-3 mt-4 sm:mt-6 lg:mt-8">
        <Progress value={33} />
        <p className="mt-2 text-sm">2 out of 5 Pdf uploaded</p>
        <p className="mt-3 text-gray-600 text-sm">Upgrade to upload more</p>
      </div> */}
    </div>
  );
};

export default SideBar;
