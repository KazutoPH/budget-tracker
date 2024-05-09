"use client"

import { TransactionType } from '@/types/types';
import React, { ReactNode, useCallback, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { CreateTransactionSchema, CreateTransactionSchemeType } from '@/schema/transaction';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import CategoryPicker from '../input/CategoryPicker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTransaction } from '@/lib/actions/transactions.action';
import { toast } from 'sonner';
import { DateToUTCDate } from '@/lib/helpers';

interface CreateTransactionModalProps {
  trigger: ReactNode;
  type: TransactionType
}

function CreateTransactionModal({ trigger, type }: CreateTransactionModalProps) {

  const [open, setOpen] = useState(false)
  // create form and validation
  const form = useForm<CreateTransactionSchemeType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date()
    }
  })

  // update the form whenever category changed
  const handleCategoryChange = useCallback((value: string) => {
    form.setValue('category', value)
  }, [form])

  // fetch data
  const queryClient = useQueryClient()

  // post request to database
  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully 🎉", {
        id: 'create-transaction',
        duration: 2000
      })

      form.reset({
        type,
        description: '',
        amount: 0,
        date: new Date(),
        category: undefined
      })

      // After creating a transaction, invalidate the overview query which wull refetch data on the home page, basically remove home page fetch cache
      queryClient.invalidateQueries({
        queryKey: ['overview']
      })

      // close modal
      setOpen(prev => !prev)
    }
  })

  // transaction modal submit function
  const onSubmit = useCallback((values: CreateTransactionSchemeType) => {
    toast.loading("Creating transaction...", {
      id: 'create-transaction'
    })

    mutate({
      ...values, //spead values
      date: DateToUTCDate(values.date) // remove time refer to helper.ts
    })
  }, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>

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
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>

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

            <div className='flex items-center flex-col sm:flex-row sm:justify-between gap-2'>
              {/* category field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className='flex flex-col w-full'>
                    <FormLabel className='mr-2'>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} onChange={handleCategoryChange} />
                    </FormControl>
                    <FormDescription>
                      Select category (required)
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Date field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className='flex flex-col w-full'>
                    <FormLabel className='mr-2'>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-mutedforeground")}>
                            {field.value ? (
                              format(field.value, 'MMMM dd yyyy')
                            ) :
                              <span>Pick a Date</span>
                            }
                            <CalendarIcon className='ml-auto h-4 w-4' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0 z-50'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return
                            field.onChange(value)
                          }}
                          initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select date for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending ? "Create" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTransactionModal