'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import Image from "next/image";
import React, { useState } from "react"
import { Button } from "./ui/button";

import { sendEmailOtp, verifysecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
const OTPModal = ({accountId,email}:{accountId:string;email:string}) => {

    const router=useRouter()
    const [isOpen,setIsopen]=useState(true);
    const [password,setpassword]=useState("");
    const[isLoading,setIsLoading]=useState(false);

    const handleSubmit=async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setIsLoading(true);
         try {
            // call api to verify the otp
            const sessionId=await verifysecret({accountId,password})
            if(sessionId) router.push('/') 
         } catch (error) {
            console.log("failed Tto Verify The OTP",error)
            
         }
         setIsLoading(false)
    };

    const handleResendOtp=async()=>{

        //call api tto verifird the otp

        await sendEmailOtp({email})

    };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsopen}>
        <AlertDialogTrigger>open</AlertDialogTrigger>
  <AlertDialogContent className="shad-alert-dialog">
    <AlertDialogHeader className="relative flex justify-center">
      <AlertDialogTitle className="h2 text-center">
        Enter Your OTP
        <Image
        src="/assets/icons/close-dark.svg"
        alt="close"
        width={20}
        height={20}
        onClick={()=>setIsopen(false)}
        className="otp-close-button"/>
        </AlertDialogTitle>
      <AlertDialogDescription className= "subtile-2 text-center text-light-100">
       we&apos;ve sent a code to your <span className="pl-1 text-brand">{email}</span>
      </AlertDialogDescription>
    </AlertDialogHeader>

    <InputOTP maxLength={6} value={password} onChange={setpassword}>
  <InputOTPGroup className="shad-otp">
    <InputOTPSlot index={0} className="shad-otp-slot"/>
    <InputOTPSlot index={1} className="shad-otp-slot"/>
    <InputOTPSlot index={2} className="shad-otp-slot"/>
    <InputOTPSlot index={3} className="shad-otp-slot"/>
    <InputOTPSlot index={4} className="shad-otp-slot"/>
    <InputOTPSlot index={5} className="shad-otp-slot"/>
  </InputOTPGroup>
</InputOTP>
    <AlertDialogFooter >
        <div className="flex w-full flex-col gap-4">
        <AlertDialogAction
        onClick={handleSubmit}
        className="shad-submit-btn h-12"
        type="button">
            Continue
            {isLoading &&  (<Image 
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="ml-2 animate-spin"/>)}
           
            
            </AlertDialogAction>
            <div className="text-center subtitle-2 mt-2 text-light-100">
                Did&apos;t not get a code ?
                <Button type="button" variant='link'
                className="pl-1 text-brand text-center" onClick={handleResendOtp}>click to Resend</Button>
            </div>

        </div>
      
      
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default OTPModal