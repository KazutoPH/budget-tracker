"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currency, currencies } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../skeleton/SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserCurrency } from "@/lib/actions/userSettings.action";
import { toast } from "sonner";


export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  // fetch user settings using tanstackquery
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch('/api/user-settings').then((res) => res.json())
  })

  React.useEffect(() => {
    if (!userSettings.data) return

    // get all data of the currency base on usersettings
    const userCurrency = currencies.find((currency) => userSettings.data.currency === currency.value);

    // set the selected currency from user settings
    if (userCurrency) setSelectedOption(userCurrency)
  }, [userSettings.data])

  // update userSettings on the database
  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    // on mutation success
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successuflly 🎉`, {
        id: "update-currency",
        duration: 2000,
      });

      setSelectedOption(
        currencies.find((c) => c.value === data.currency) || null
      );
    },

    // on mutation error
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong", {
        id: "update-currency",
        duration: 2000,
      });
    },
  });

  // selection option function and update usersettings on change
  const selectOption = React.useCallback((currency: Currency | null) => {

    // diplays toast 
    if (!currency) {
      toast.error("Please select a currency")
      return
    }

    // diplays toast 
    toast.loading("Updating currency...", { id: "update-currency" })

    mutation.mutate(currency.value)
  }, [mutation])

  if (isDesktop) {
    return (
      <SkeletonWrapper isloading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
          {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  currencies.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
