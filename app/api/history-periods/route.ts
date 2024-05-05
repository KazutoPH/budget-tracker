import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TypeOf } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // get history period function
  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
}

export type getHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

// get history period function
async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    //Return the current year
    return [new Date().getFullYear()];
  }

  return years;
}
