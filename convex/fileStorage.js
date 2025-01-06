import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const AddFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async ({ db }, { fileId, storageId, fileName, createdBy,fileUrl }) => {
    await db.insert("pdfFiles", {
      fileId,
      storageId,
      fileName,
      fileUrl,
      createdBy,
    });
    return "File entry added to database";
  },
});

export const getFilesUrl = mutation({
  args: {
    storageId: v.string(), 
  },
  handler: async ({ storage }, { storageId }) => {
    const url = await storage.getUrl(storageId); // Ensure `storage` is passed from `ctx`.
    return url;
  },
});
