"use client"

import { CreateCategoryScemaType, CreateCategorySchema } from '@/schema/categories'
import { TransactionType } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { PlusSquare } from 'lucide-react'

interface CreateCategoryModalProps {
  type: TransactionType
}

function CreateCategoryModal({ type }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false)

  // create categoryform
  const form = useForm<CreateCategoryScemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    }
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'>
          <PlusSquare className=' h-4 w-4' />
          Create New
        </Button>
      </DialogTrigger>
    </Dialog>
  )
}

export default CreateCategoryModal