import { mutation, query } from "./_generated/server";
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

export const GetFileRecord = query(
  {
    args: {
      fileId : v.string()
    },
    handler:async(ctx,args) =>{
      const result = await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileId'),args.fileId))
      .collect()

      console.log(result)
      return result[0]
    }
  }
)

export const GetUserFiles = query({

  args: {
    userEmail:v.optional(v.string())
  },
  handler:async(ctx,args)=>{
    if(!args?.userEmail){
      return;
    }
    const result = await ctx.db.query('pdfFiles')
    .filter((q)=>q.eq(q.field('createdBy'),args.userEmail)).collect()

    return result
  }
}
)
  