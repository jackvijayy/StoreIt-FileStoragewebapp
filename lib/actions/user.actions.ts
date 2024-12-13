"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient,  } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholder } from "@/constants";
import { redirect } from "next/navigation";




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
 export const sendEmailOtp=async({email}:{email:string})=>{
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
                avatar:avatarPlaceholder,
                accountId,
            }
        )
    }
    return parseStringify({ accountId });

};

export const verifysecret=async({accountId,password}:{accountId:string;password:string})=>{
    try {

        const { account }= await createAdminClient();
        const session = await account.createSession(accountId,password); //semicolon for promise not returanable
        (await cookies()).set('appwrite-session',session.secret,{
            path:'/',
            httpOnly:true,
            sameSite:"strict",
            secure:true,


        })
        return parseStringify({session:session.$id})
        
    } catch (error) {
        handlError(error,"failed to verify the OTP")
        
    }

}

export const getCurrentuser=async()=>{
    const {account,databases}=await createSessionClient();
    const result=await account.get();

    const user=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId',[result.$id])]

    )
    if(user.total <= 0) return null

    return parseStringify(user.documents[0])


}

export const signoutUser= async()=>{

    const {account}= await createSessionClient()
    try {

       await account.deleteSession("current");
       (await cookies()).delete("appwrite-session");
        
    } catch (error) {
        handlError(error,"Faild to logout");
        
    }
    finally{
        redirect("/sign-in")

    }


}

export const signInuser= async({email}:{email:string;})=>{

    try {
        const existingUser=await getUserByEmail(email)
        if(existingUser){
            await sendEmailOtp({email});
            return parseStringify({accountId:existingUser.accountId});
        }
        return parseStringify({accountId:null,error:"user Not found"});
        
    } catch (error) {
        handlError(error,"Failed to sign in user");
        
    }


}