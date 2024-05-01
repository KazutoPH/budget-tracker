"use client"

import { TransactionType } from '@/types/types';
import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { CreateTransactionSchema, CreateTransactionSchemeType } from '@/schema/transaction';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import CategoryPicker from '../input/CategoryPicker';

interface CreateTransactionModalProps {
  trigger: ReactNode;
  type: TransactionType
}

function CreateTransactionModal({ trigger, type }: CreateTransactionModalProps) {

  // create form and validation
  const form = useForm<CreateTransactionSchemeType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date()
    }
  })
  return (
    <Dialog>

      {/* dialog trigger base on the children more specifically button */}
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      {/* modal content */}
      <DialogContent>

        {/* shadcnheader */}
        <DialogHeader>
          <DialogTitle>Create a new <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-red-500")}>{type}</span> transaction</DialogTitle>
        </DialogHeader>

        {/* shadcn form */}
        <Form {...form}>
          <form className='space-y-4'>

            {/* description form field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue='' {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction desciption (optional)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* amount form field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />


            <div className='flex items-center justify-between gap-2'>
              {/* category field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} />
                    </FormControl>
                    <FormDescription>
                      Select category (required)
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTransactionModal