"use client"
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const {user} = useUser();
  const createUser = useMutation(api.user.createUser);

useEffect(() => {
  user&&CheckUser()
}, [user])

const CheckUser = async () => {
  const res = await createUser({
    email: user?.primaryEmailAddress?.emailAddress,
    userName: user?.fullName,
    imageUrl: user?.imageUrl,
  })
  console.log(res)
}

  return (
   <div>
      <h1>Hello </h1>
      <Button>Click here</Button>
      <UserButton/>
   </div>
  );
}
