'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constants'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { renameFile } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'
// import { DialogContent } from '@radix-ui/react-dialog'

const ActionDropdown = ({file}:{file:Models.Document}) => {
  const [isModelOpen, setisModelOpen] = useState(false);
  const[isDropdownOpen,setIsDropdownOpen]=useState(false);
  const [action,setAction]=useState<ActionType | null>(null);
  const[name,setname]=useState(file.name);;
  const[isLoading,setIsLoading]=useState(false);
  const path=usePathname();

  const closeAllModel=()=>{
    setisModelOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setname(file.name);
    // setEmails([])
  }

  const handleAction=async()=>{
    if(!action) return;
    setIsLoading(true);
    let success=false;
    const actions={
      rename:()=>renameFile({fileId:file.$id,name,extension:file.extension,path}),
      share:()=>console.log("share"),
      delete:()=>console.log("delete"),
  };
  success=await actions[action.value as keyof typeof actions]();

  if(success) closeAllModel();
  setIsLoading(false)


    

  };

  const renderDialogContent=()=>{
    if(!action) return null;
    const {value,label}=action;
    return(
      <DialogContent className='shad-dialog button'>
      <DialogHeader className='flex flex-col gap-3'>
        <DialogTitle className='text-center text-light-100'>
          {label}
          </DialogTitle>
          {value==='rename' && <Input type="text"
           value={name}
           onChange={(e)=>setname(e.target.value)}/>}

       
      </DialogHeader>
      {['rename','delete','share'].includes(value)&&(
        <DialogFooter className='flex flex-col gap-3 md:flex-row'>
          <Button onClick={closeAllModel} className='modal-cancel-button'>
            Cancel
          </Button>
          <Button onClick={handleAction} className='modal-submit-button'>
            <p className='capitalize'>{value}</p>
            {isLoading && (
              <Image
              src="assest/icons/loader.svg"
              alt='loader'
              width={24}
              height={24}
              className='animate-spin'
              />
            )}
          </Button>

        </DialogFooter>
      )}
    </DialogContent>
    )

  }
  return (
    <Dialog open={isModelOpen} onOpenChange={setisModelOpen}>
 <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
  <DropdownMenuTrigger className='shad-no-focus'>
    <Image src="/assets/icons/dots.svg"
    alt='dropdown'
    width={34}
    height={34}
    className='z-50'/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className='max-w-[200px] truncate'>
      {file.name}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value,
                  )
                ) {
                  setisModelOpen (true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
    
  </DropdownMenuContent>
</DropdownMenu>
{renderDialogContent()}
</Dialog>
  )
}

export default ActionDropdown