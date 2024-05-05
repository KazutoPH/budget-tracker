"use client";

import { TransactionType } from "@/types/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import CreateCategoryModal from "../modal/CreateCategoryModal";
import { Check, ChevronsUpDown } from "lucide-react";

interface CategoryPickerProps {
  type: TransactionType;
  onChange: (value: string) => void
}

function CategoryPicker({ type, onChange }: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // update value on transaction modal form whenever value changes
  useEffect(() => {
    if (!value) return;
    onChange(value) //when the value changes, call the onChange callback
  }, [onChange, value])

  // get categories from database
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  // select category function
  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );

  // on categoryselect change current value
  const successCallback = useCallback((category: Category) => {
    setValue(category.name)
    setOpen(prev => !prev)
  }, [setValue, setOpen])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select Category"
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />

          {/* Custom Category Modal component */}
          <CreateCategoryModal
            type={type}
            onSuccessCallback={successCallback}
          />
          <CommandEmpty className="flex flex-col items-center">
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            {/* List of Categories from Categories Query */}
            <CommandList>
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    className="cursor-pointer flex items-center"
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    {value === category.name && (
                      <Check className="ml-2 w-4 h-4" />
                    )}
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img" className="w-[20px]">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}

export default CategoryPicker;
