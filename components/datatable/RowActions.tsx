"use client";

import { useState } from "react";
import { TransactionHistoryRow } from "./TransactionTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import DeleteTransactionModal from "../modal/DeleteTransactionModal";

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <>
      <DeleteTransactionModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        transactionId={transaction.id}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onSelect={() => setShowDeleteModal((prev) => !prev)}
          >
            <TrashIcon className="h-4 w-4 text-muted-foreground" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default RowActions;
