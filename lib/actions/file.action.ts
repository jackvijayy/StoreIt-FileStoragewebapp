'use server'

import { uploadFileProps } from "@/types"
import { createAdminClient } from "../appwrite"
import {InputFile} from"node-appwrite/file"
import { appwriteConfig } from "../appwrite/config"
import { ID } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { error } from "console"
import { revalidatePath } from "next/cache"

const handlError=(error:unknown,message:string)=>{
    console.log(error,message);
    throw error

}

export const uploadFile= async ({file,ownerId,accountId,path}:uploadFileProps)=>{
    const {storage,databases}=await createAdminClient();
    try {
        const inputFile=InputFile.fromBuffer(file,file.name);
        const bucketFile=await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        )
        const fileDocument={
            type:getFileType(bucketFile.name).type,
            name:bucketFile.name,
            url:constructFileUrl(bucketFile.$id),
            extension:getFileType(bucketFile.name).extension,
            size:bucketFile.sizeOriginal,
            owner:ownerId,
            accountId,
            user:[],
            bucketFileId:bucketFile.$id,
        };

        const newFile=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument
        )
        .catch(async(error:unknown)=>{
            await storage.deleteFile(appwriteConfig.bucketId,bucketFile.$id)
            handlError(error,"Failed t0 create the file doument")

        });
        revalidatePath(path);
         return parseStringify(newFile); 
        
    } catch (error) {
        handlError(error,"faile to Upload Files")
        
    }

}