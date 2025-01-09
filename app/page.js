"use client"
import { Button } from "@/components/ui/button";
import { SignIn, UserButton, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect,useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion"
import { FileText, Edit3, Zap, Upload, Download, Check, ChevronDown, Linkedin, ArrowBigRight } from 'lucide-react'
import { loadFull } from "tsparticles"
import { Input } from "@/components/ui/input";

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // Only create the ref after the component is mounted
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) => (pos === 1 ? 'relative' : 'fixed'))

  // Set mounted state to true once component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // User logic
  const { user } = useUser()
  const createUser = useMutation(api.user.createUser)

  // Check if user is defined and create a user if necessary
  useEffect(() => {
    if (user) {
      CheckUser()
    }
  }, [user])

  const CheckUser = async () => {
    if (user) {
      const res = await createUser({
        email: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        imageUrl: user?.imageUrl,
      })
      console.log(res)
    }
  }

  // Only render content after mounting
  if (!mounted) return null
return (
  <div className="flex flex-col min-h-screen bg-gray-900 text-white">
    <header className="px-4 lg:px-6 h-18 flex items-center fixed w-full z-50 bg-gray-900/80 ">
    <Link className="flex items-center text-white justify-center" href="#">
        <Image src={'/logo.svg'} alt="logo" width={80} height={60} className="text-white mt-2"/> 
      </Link>
      {/* <nav className="ml-auto flex gap-4 sm:gap-6">
      </nav> */}
    </header>
    <main className="flex-1">
      <section ref={targetRef} className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div 
          className="container px-4 md:px-6 flex flex-col items-center text-center "
          style={{ opacity, scale, position }}
        >
          <motion.h1 
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-500"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform Your PDFs into
            <br />
            Intelligent Notes
          </motion.h1>
          <motion.p 
            className="mt-4 max-w-[600px] text-gray-400 md:text-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our AI-powered tool extracts key information from your PDFs and creates editable notes, saving you time and boosting productivity.
          </motion.p>
          <motion.div 
            className="mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8 py-6 text-lg font-semibold">

              <Link href={'/dashboard'}>
              Get Started 
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-purple-400" />
        </motion.div>
      </section>
      <section id="features" className="w-full py-20 md:py-40 relative bg-gray-800 z-10">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Powerful Features</h2>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: Zap, title: "AI-Powered Extraction", description: "Our advanced AI algorithms extract key information from your PDFs with high accuracy." },
              { icon: Edit3, title: "Built-in Text Editor", description: "Edit, format, and organize your notes with our intuitive text editor." },
              { icon: Upload, title: "Easy PDF Upload", description: "Simply drag and drop your PDFs or select them from your device." },
              { icon: Download, title: "Export Options", description: "Export your notes in various formats including PDF, Word, and plain text." },
              { icon: Check, title: "Smart Summarization", description: "Get concise summaries of your PDFs, highlighting the most important points." },
              { icon: FileText, title: "Multiple File Support", description: "Process multiple PDFs at once and organize them into projects." },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 p-4 bg-purple-600 rounded-full">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 ">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4 mx-8">
                <motion.h2 
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Experience the Power of AI in Note-Taking
                </motion.h2>
                <motion.p 
                  className="max-w-[600px] text-gray-400 md:text-xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our AI-powered tool doesn't just convert PDFs; it understands them. Get smart, contextual notes that capture the essence of your documents.
                </motion.p>
                <motion.ul 
                  className="grid gap-4 mt-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {[
                    "Intelligent keyword extraction",
                    "Automatic chapter and section detection",
                    "Smart cross-referencing between documents",
                    "Contextual summaries for each section"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button className="mt-4">
                  <Link href={'/dashboard'}>
                    Try it now
                  </Link>                   
                    <ArrowBigRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={'/ai_notes.jpg'}
                  width={600}
                  height={400}
                  alt="AI NoteTaker in action"
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
      <section id="cta" className="w-full py-20 md:py-40 bg-purple-600">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Revolutionize Your Note-Taking?
            </h2>
            <p className="mx-auto max-w-[600px] text-xl text-purple-100">
              Join thousands of students and professionals who have transformed their study and work habits with AI NoteTaker.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input className="flex-1 bg-white text-gray-900 placeholder-gray-500" placeholder="Enter your email" type="email" />
                <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">
                
                  Get Started
                 
                  </Button>
              </form>
              <p className="text-sm text-purple-100">
                Start your free trial today. No credit card required.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    <footer className="w-full py-6 bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              Terms
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              Privacy
            </Link>
          </div>
          <div className="flex items-center space-x-4">         
            <Link href="https://www.linkedin.com/in/vedant-upadhye-84b136234/" className="text-gray-400 hover:text-purple-400">
              <Linkedin />
            </Link>
            <Link href="https://github.com/vedantupadhye" className="text-gray-400 hover:text-purple-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          © 2024 AI NoteTaker. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
)
 
}


 // return (
  //  <div>
  //     <h1>Hello </h1>
      // <Button>
      //   <Link href={'/dashboard'}>
      //   signin
      //   </Link>
      // </Button>
  //     <UserButton/>
  //  </div>
  // );