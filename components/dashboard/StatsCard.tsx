import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route'
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { ReactNode, useCallback, useMemo } from 'react'
import SkeletonWrapper from '../skeleton/SkeletonWrapper'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Card } from '../ui/card'
import CountUp from 'react-countup'

interface StatsCardProps {
  userSettings: UserSettings
  from: Date,
  to: Date
}

function StatsCard({
  userSettings,
  from,
  to }: StatsCardProps) {

  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`)
        .then((res) => res.json())
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings])

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense

  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isloading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={<TrendingUp className='h-12 w-12 items-center rounded-lg text-emerald-500 bg-emerald-400/10' />}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isloading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={<TrendingDown className='h-12 w-12 items-center rounded-lg text-red-500 bg-red-400/10' />}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isloading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={<Wallet className='h-12 w-12 items-center rounded-lg text-violet-500 bg-violet-400/10' />}
        />
      </SkeletonWrapper>
    </div>
  )
}

// StatCard Component
function StatCard({ formatter, value, title, icon }: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode;
}) {

  // format value
  const formatFN = useCallback((value: number) => {
    return formatter.format(value)
  }, [formatter])

  return (
    <Card className='flex h-24 w-full items-center gap-2 p-4'>
      {icon}
      <div className='flex flex-col items-start gap-0'>
        <p className="text-muted-foreground">{title}</p>

        {/* reaect-counter animation */}
        <CountUp
          preserveValue
          redraw={false}
          decimals={2}
          formattingFn={formatFN}
          className='text-2xl'
          end={value}
        />
      </div>
    </Card>
  )
}

export default StatsCard