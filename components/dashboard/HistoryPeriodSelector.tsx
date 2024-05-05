"use client"

import { Period, Timeframe } from "@/types/types"
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../skeleton/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { getHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface HistoryPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframer: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframer
}: HistoryPeriodSelectorProps) {

  // get history periods
  const historyPeriods = useQuery<getHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch('/api/history-periods').then((res) => res.json())
  })
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isloading={historyPeriods.isFetching} fullwidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={value => setTimeframer(value as Timeframe)}>
          <TabsList>
            <TabsTrigger value="year">
              Year
            </TabsTrigger>
            <TabsTrigger value="month">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isloading={historyPeriods.isFetching} fullwidth={false} >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />

        </SkeletonWrapper>

        {timeframe === "month" && (
          <SkeletonWrapper isloading={historyPeriods.isFetching} fullwidth={false}>
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
            />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}

// Year Selector Component
function YearSelector({ period,
  setPeriod,
  years }: {
    period: Period;
    setPeriod: (period: Period) => void
    years: getHistoryPeriodsResponseType
  }) {
  return (
    // year selector
    <Select
      value={period.year.toString()}
      onValueChange={value => {
        setPeriod({
          month: period.month,
          year: parseInt(value)
        })
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map(year => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


// Month Selector Component
function MonthSelector({ period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void
}) {
  return (
    // year selector
    <Select
      value={period.month.toString()}
      onValueChange={value => {
        setPeriod({
          year: period.year,
          month: parseInt(value)
        })
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {/* get all array representing each month */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
          const monthStr = new Date(period.year, month, 1).toLocaleString("default", { month: "long" })
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          )

        })}
      </SelectContent>
    </Select>
  )
}

export default HistoryPeriodSelector