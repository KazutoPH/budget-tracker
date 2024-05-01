"use client"

import { TransactionType } from '@/types/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Command, CommandInput } from '../ui/command'
import CreateCategoryModal from '../modal/CreateCategoryModal'

interface CategoryPickerProps {
  type: TransactionType
}

function CategoryPicker({ type }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  // get categories from database
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () => fetch(`/api/categories?type=${type}`)
      .then(res => res.json())
  })

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  )
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={'outline'} role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
          {selectedCategory ?
            <CategoryRow category={selectedCategory} />
            : (
              "Select Category"
            )
          }
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0'>
        <Command onSubmit={e => { e.preventDefault() }}>
          <CommandInput placeholder='Search category...' />

          {/* Custom Category Modal component */}
          <CreateCategoryModal type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  )
}


function CategoryRow({ category }: { category: Category }) {
  return <div className='flex items-center gap-2'>
    <span role='img'>{category.icon}</span>
    <span>{category.name}</span>
  </div>
}

export default CategoryPicker