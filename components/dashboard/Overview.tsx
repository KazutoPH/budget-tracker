"use client"

import { UserSettings } from "@prisma/client"
import { differenceInDays, startOfMonth } from "date-fns"
import { useState } from "react"
import { DateRangePicker } from "../input/DateRangePicker"
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants"
import { toast } from "sonner"
import StatsCard from "./StatsCard"
import CategoriesStats from "./CategoriesStats"

interface OverviewProps {
  userSettings: UserSettings
}

function Overview({ userSettings }: OverviewProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date()
  })


  return (
    <>
      <div className="container flex flex-wrap items-end justify-between ga-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          {/* Custom Date Range Picker component         */}
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={values => {
              const { from, to } = values.range

              // update the date range if both dates are set
              if (!from || !to) return

              // check if date range is more than max date range
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(`The selected date range is to big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`, {
                  duration: 4000
                })
                return
              }
              setDateRange({ from, to })
            }}
          />
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCard
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>

    </>
  )
}

export default Overview