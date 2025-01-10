'use client'

import { motion } from "framer-motion"
import { ArrowRight, Upload, Sparkles, Edit3 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
    {
      icon: Upload,
      title: "Upload Your PDF",
      description: "Simply drag and drop your PDF file into our intuitive interface. ",
      video: "/pdf-ai2.mp4"  // Use a video URL
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Just select the content and click on AI button and Watch as our advanced AI algorithms extract key information, summarize content, and organize your notes into a structured format.",
      video: "/pdf-ai-1.mp4"  // Use a video URL
    },
    {
      icon: Edit3,
      title: "Edit and Customize",
      description: "Use our built-in text editor to refine your notes. Add comments, highlight important points, and tailor the content to your needs.",
      video: "/pdf-ai-3.mp4"  // Use a video URL
    }
  ]

  export default function LearnMorePage() {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <header className="px-4 lg:px-6 h-18 py-2 flex items-center border-b border-gray-800">
          <div className="flex items-center">
            <Link href={'/'}>
            <Image src={'/logo.svg'} alt='logo' width={80} height={60} />
            </Link>
            
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button className='bg-white text-black hover:bg-bg-amber-100 hover:scale-105 font-semibold'>
              <Link href={'/dashboard'}>
                Try it now
              </Link>              
            </Button>    
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Learn How AI NoteTaker Works
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Transform your PDFs into smart, editable notes in just three simple steps. Experience the power of AI-driven note-taking.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 mx-auto max-w-5xl">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="grid items-center gap-6 lg:grid-cols-2 my-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <div className={`space-y-2 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                      <div className={`inline-block rounded-lg bg-purple-900 p-2`}>
                        <step.icon className={`h-6 w-6 text-purple-400`} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <video
                        src={step.video}  // Use the video source
                        autoPlay
                        loop
                        muted
                        className="relative rounded-lg shadow-2xl"
                        style={{ width: "100%", height: "auto" }}  // Ensures proper video sizing
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-12 lg:py-24 bg-gray-800">
            <div className="container px-4 md:px-6">
              <motion.div
                className="flex flex-col items-center space-y-4 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of students, researchers, and professionals who have revolutionized their workflow with AI NoteTaker.
                </p>
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-700 disabled:pointer-events-none disabled:opacity-50">
                  <Link href={'/dashboard'}>
                  Start your Journey
                  </Link>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
          <p className="text-xs text-gray-400">© 2024 AI NoteTaker. All rights reserved.</p>
          {/* <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
              Privacy
            </Link>
          </nav> */}
        </footer>
      </div>
    )
  }
  
