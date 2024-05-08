"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { DeleteTransaction } from "@/lib/actions/transactions.action";

interface DeleteTransactionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

function DeleteTransactionModal({
  open,
  setOpen,
  transactionId,
}: DeleteTransactionModalProps) {
  const queryClient = useQueryClient();

  // delete category function
  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("Transaction deleted successfully", {
        id: transactionId,
      });

      // remove cache
      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: () => {
      toast.success("Something went wrong", {
        id: transactionId,
      });
    },
  });
  return (
    // alert dialog ui
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.success("Deleting transaction...", {
                id: transactionId,
              });

              // onClick Trigger mutation
              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTransactionModal;
