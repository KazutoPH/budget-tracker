import React, { ReactNode } from 'react'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonWrapperType {
  children: ReactNode
  isloading: boolean
  fullwidth?: boolean
}

function SkeletonWrapper({
  children,
  isloading,
  fullwidth = true
}: SkeletonWrapperType) {
  if (!isloading) return children
  return (
    <Skeleton className={cn(fullwidth && 'w-full')}>
      <div className='opacity-0'>{children}</div>
    </Skeleton>
  )
}

export default SkeletonWrapper