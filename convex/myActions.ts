import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.array(v.string()), 
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    const metadataArray = args.splitText.map((text) => ({ fileId: args.fileId }));
    await ConvexVectorStore.fromTexts(
        args.splitText, // Array of text strings
        metadataArray,
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyC3oowYSR26Cy2XOEwa8tgYGjd9Kr7r6UU',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }

    );
    return"completed"

  },
});