"use client"

import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import SkeletonWrapper from '../skeleton/SkeletonWrapper'
import { TransactionType } from '@/types/types'
import { GetCategoriesStatusResponseType } from '@/app/api/stats/categories/route'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Progress } from '../ui/progress'

interface CategoriesStatsProps {
  userSettings: UserSettings
  from: Date,
  to: Date
}

function CategoriesStats({
  userSettings,
  from,
  to,
}: CategoriesStatsProps) {

  // get data of stats
  const statsQuery = useQuery<GetCategoriesStatusResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`)
      .then((res) => res.json())
  })

  // format currency
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper isloading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isloading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  )
}


// categories card component
function CategoriesCard({ formatter, type, data }: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatusResponseType;
}) {
  // filter data base on type
  const filterData = data.filter(el => el.type === type)

  // get total using reduce function
  const total = filterData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0)

  return (
    <Card className='h-80 w-full col-span-6'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {type === 'income' ? 'Incomes' : 'Expenses'} by category
        </CardTitle>

        <div className='flex items-center justify-between gap-2'>
          {filterData.length === 0 && (
            <div className='flex h-60 w-full flex-col items-center justify-center'>
              No data for the selected period
              <p className='text-sm text-muted-foreground'>
                Try selected a different period or type add new {type === "income" ? 'incomes' : 'expenses'}
              </p>
            </div>
          )}

          {filterData.length > 0 && (
            <ScrollArea className='h-60 w-full px-4'>
              <div className='flex w-full flex-col gap-4 p-4'>
                {filterData.map(item => {
                  const amount = item._sum.amount || 0
                  const percentage = (amount * 100) / (total || amount)

                  return (
                    <div className='flex flex-col gap-2' key={item.category}>
                      <div className="flex items-center justify-between">

                        {/* category name and percentage */}
                        <span className='flex items-center text-gray-400'>
                          {item.categoryIcon} {item.category}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </span>

                        {/* formatted amount */}
                        <span className='text-sm text-gray-400'>
                          {formatter.format(amount)}
                        </span>
                      </div>

                      <Progress
                        value={percentage}
                        indicator={type === "income" ? "bg-emerald-500" : 'bg-red-500'}
                      />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}

export default CategoriesStats