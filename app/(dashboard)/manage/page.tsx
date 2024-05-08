"use client";

import { CurrencyComboBox } from "@/components/input/CurrencyComboBox";
import CreateCategoryModal from "@/components/modal/CreateCategoryModal";
import SkeletonWrapper from "@/components/skeleton/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  PlusSquareIcon,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Category } from "@prisma/client";
import React from "react";
import { DeleteCategory } from "@/lib/actions/categories.action";
import DeleteCategoryModal from "@/components/modal/DeleteCategoryModal";

function page() {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

// category list component
function CategoryList({ type }: { type: TransactionType }) {
  // get the list of categories base on type
  const categoryiesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvalable =
    categoryiesQuery.data && categoryiesQuery.data.length > 0;

  return (
    <SkeletonWrapper isloading={categoryiesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === "income" ? "Income" : "Expenese"} categories
                <div className="text-sm text-foreground">Sorted by name</div>
              </div>
            </div>
            <CreateCategoryModal
              type={type}
              onSuccessCallback={() => categoryiesQuery.refetch}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquareIcon className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>

        <Separator />
        {!dataAvalable ? (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* list of categories  */}
            {categoryiesQuery.data.map((category: Category) => (
              <CategoryCard
                category={category}
                key={category.name}
              ></CategoryCard>
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

// Category Card Component
function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryModal
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 -w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}

export default page;
