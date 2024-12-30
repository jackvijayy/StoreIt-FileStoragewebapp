'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants'
import { Value } from '@radix-ui/react-select'


const Sort = () => {
  const path=usePathname();
  const router=useRouter()
  const handleSort=()=>{
    router.push(`${path}?sort=${Value}`)
  }
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
  <SelectTrigger className="sort-select">
    <SelectValue placeholder={sortTypes[0].value} />
  </SelectTrigger>
  <SelectContent className='sort-select-content'>
    {sortTypes.map((sort)=>(
       <SelectItem  
       key={sort.label} 
       className='shad-select-item'
       value={sort.value}
       >
        {sort.label}
       </SelectItem>

    ))}
   
    
  </SelectContent>
</Select>
  )
}

export default Sort