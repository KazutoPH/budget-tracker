import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // get url search params
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  // validate data
  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    year,
    month,
  });

  if (!queryParams.success)
    return Response.json(queryParams.error.message, { status: 400 });

  // get history data function
  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}

export type GetHistoryDataResponseTye = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  // check what timeframe is selected
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);

    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

// get year history data function
async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    // get the sum of expense and income each month
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  // iterate check if there is data exist for the month
  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    // push data for each data of month exist
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  return history;
}

// get monthhistory data
async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  // get data from database
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  // check the days in month
  const daysInMonth = getDaysInMonth(new Date(year, month));

  // iterate for each days in month
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    // if data exist on the day change value
    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  return history;
}
