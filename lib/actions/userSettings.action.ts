"use server";

import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

export async function UpdateUserCurrency(currency: string) {
  // validate if currency exist
  const parseBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parseBody.success) {
    throw parseBody.error;
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // update currency on the database
  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  revalidatePath("/");

  return userSettings;
}
