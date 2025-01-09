
"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });
  console.log(fileList);

  return (
    <div>
      <h1 className="font-medium text-3xl">Workspace</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {fileList?.length > 0 ? (
          fileList.map((file) => (
            <Link
              key={file.fileId} // Ensure fileId is unique
              href={'/workspace/'+file.fileId}
            >
              <div
                className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border gap-5 mt-10 cursor-pointer hover:scale-105 transition-all"
              >
                <Image src={"/pdf-file.png"} alt="pdf-img" width={50} height={50} />
                <h2 className="mt-2 font-semibold text-lg">{file.fileName}</h2>
              </div>
            </Link>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item} // Use the item's unique value as the key
              className="bg-slate-200 rounded-md h-[150px] animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
