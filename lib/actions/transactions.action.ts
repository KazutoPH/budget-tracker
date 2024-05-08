"use server";

import {
  CreateTransactionSchema,
  CreateTransactionSchemeType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../prisma";
import { DateToUTCDate } from "../helpers";

export async function CreateTransaction(form: CreateTransactionSchemeType) {
  // check form validation
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  // destructure of parsedBody
  const { amount, category, date, description, type } = parsedBody.data;

  // check if category exist
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  // Note: don't make confusion between $transaction (prisma) and prisma.transaction (table)

  let parseDate = DateToUTCDate(date);

  // $transaction method make mutiple database opration and determined if one failed
  await prisma.$transaction([
    // Create User Transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date: parseDate,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update aggregates table
    //create month history record  or update if it exist
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          // remove time value
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      // create month hitory is doesn't exist
      create: {
        userId: user.id,
        // remove time value
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // update expense and income if already exist
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    //update year aggregate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          // remove time value
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      // create month hitory is doesn't exist
      create: {
        userId: user.id,
        // remove time value
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // update expense and income if already exist
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}

// delete transaction function
export async function DeleteTransaction(id: string) {
  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  // check if transaction exist
  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("bad request");
  }

  await prisma.$transaction([
    //Delete transaction from db
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    //Update month history
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
