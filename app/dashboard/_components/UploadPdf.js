"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";

const UploadPdf = ({ children }) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFilesUrl = useMutation(api.fileStorage.getFilesUrl);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [fileName, setFileName] = useState("");

  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    try {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
      setLoading(true);

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type || "application/pdf" },
        body: file,
      });

      const { storageId } = await result.json();
      console.log("Storage ID:", storageId);
      const fileId = uuid4();
      const fileUrl = await getFilesUrl({ storageId:storageId });
      const resp = await addFileEntry({
        fileId,
        storageId,
        fileName: fileName || "Untitled File",
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown User"

      });

      console.log("Response:", resp);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Pdf file</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className="mt-6">Select a file to Upload</h2>
              <div className="flex gap-2 p-3 mt-2 rounded-md border">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => onFileSelect(event)}
                />
              </div>
              <div className="mt-2">
                <label>File Name</label>
                <Input
                  placeholder="File Name"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={onUpload} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPdf;
