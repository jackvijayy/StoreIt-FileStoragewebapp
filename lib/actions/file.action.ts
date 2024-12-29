'use server'

import { uploadFileProps } from "@/types"
import { createAdminClient } from "../appwrite"
import {InputFile} from"node-appwrite/file"
import { appwriteConfig } from "../appwrite/config"
import { ID, Models, Query } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"
import { getCurrentuser } from "./user.actions"

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
            size:255,
            owner:ownerId,
            accountId,
            // user:[],
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
const createQueries=(currentUser:Models.Document,
    types:string[],
    searchText:string,
    sort:string,
    limit?:number
)=>{
    const queries=[
        Query.or([
            Query.equal('owner',[currentUser.$id]),
            Query.contains('users',[currentUser.email])
        ])
    ];
    if(types.length > 0) queries.push(Query.equal("type",types))
    if(searchText) queries.push(Query.contains("name",searchText))
    if(limit) queries.push(Query.limit(limit))


        if(sort){
            const [sortBy,orderBy]=sort.split('-');
            queries.push(orderBy==='asc'? Query.orderAsc(sortBy):Query.orderDesc(sortBy));
        }
   

   return queries
};

export const getFiles=async({types=[],searchText='',sort='$createdAt-desc',limit}:GetFilesProps)=>{
    const {  databases }= await createAdminClient();
    try {
        const currentUser=await getCurrentuser();
        console.log(currentUser)

        if(!currentUser) throw new Error('user Not Found');

        const queries=createQueries(currentUser,types,searchText,sort,limit);

        console.log(currentUser,queries)
        const files=await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries

        )
        console.log(files)
        return parseStringify(files)
        
    } catch (error) {
        handlError(error,"Failed to get files")
        
    }


}

 export const renameFile= async({fileId,name,extension,path}:RenameFileProps)=>{
    const {databases}= await createAdminClient();
    try {
        const newName=`${name}.${extension}`;
        const updateFile=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name:newName
            }
        );
        revalidatePath(path);
        return parseStringify(updateFile);

        
    } catch (error) {
        handlError(error,"Failed To Rename the File")
        
    }
}

export const updateFileUsers= async({fileId,emails,path}:UpdateFileUsersProps)=>{
    const {databases}= await createAdminClient();
    try {
       
        const updateFile=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users:emails,
            }
        );
        revalidatePath(path);
        return parseStringify(updateFile);

        
    } catch (error) {
        handlError(error,"Failed To Rename the File")
        
    }
}

export const deleteFile= async({fileId,bucketFileId,path}:DeleteFileProps)=>{
    const {databases,storage}= await createAdminClient();
    try {
       
        const deletedFile=await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
        );
        if(deletedFile){
            await storage.deleteFile(appwriteConfig.bucketId,bucketFileId)
        }
        revalidatePath(path);
        return parseStringify({status:"success"});

        
    } catch (error) {
        handlError(error,"Failed To Rename the File")
        
    }
}