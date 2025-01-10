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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
        {fileList ? (
          fileList.length > 0 ? (
            fileList.map((file) => (
              <Link
                key={file.fileId} // Ensure fileId is unique
                href={'/workspace/' + file.fileId}
              >
                <div
                  className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border gap-5 cursor-pointer hover:scale-105 transition-all"
                >
                  <Image src={"/pdf-file.png"} alt="pdf-img" width={50} height={50} />
                  <h2 className="mt-2 font-semibold text-lg">{file.fileName}</h2>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No files yet. Upload your first file to get started.
            </p>
          )
        ) : (
          <p className="text-center text-gray-500 my-40 col-span-full">
            Loading files...
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
