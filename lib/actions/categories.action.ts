"use server";

import {
  CreateCategoryScemaType,
  CreateCategorySchema,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../prisma";

export async function CreateCategory(form: CreateCategoryScemaType) {
  // validate data
  const parseBody = CreateCategorySchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  const { name, icon, type } = parseBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

// Delete Category Action
export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parseBody = DeleteCategorySchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("sign-in");
  }

  const categories = await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parseBody.data.name,
        type: parseBody.data.type,
      },
    },
  });

  return categories;
}
