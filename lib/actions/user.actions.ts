"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";



const getUserByEmail=async(email:string)=>{
    const { databases }=await createAdminClient();
    const result=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email',[email])]
    )
    return result.total > 0 ? result.documents[0] : null

};

const handlError=(error:unknown,message:string)=>{
    console.log(error,message);
    throw error

}
const sendEmailOtp=async({email}:{email:string})=>{
    const {account}=await createAdminClient()

    try {
        const session=await account.createEmailToken(ID.unique(),email);
        return session.userId

        
    } catch (error) {
        handlError(error,"Failed to send Email OTP")

        
    }


}


 export const createAccount=async({fullName,email}:{fullName:string;email:string;})=>{
    const existingUser=await getUserByEmail(email);
    const accountId=await sendEmailOtp({ email });
    if(!accountId) throw new Error("failed to send a OTP");

    if(!existingUser){
        const {databases}=await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),{
                fullName,
                email,
                avatar:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Favatar-icon-placeholder-facebook-1577909%2F&psig=AOvVaw0OFO6P3ULPVUBllQIHqv5V&ust=1733917162338000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPip-IePnYoDFQAAAAAdAAAAABAE",
                accountId
            }
        )
    }
    return parseStringify({ accountId });

};