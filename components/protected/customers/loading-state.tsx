import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CustomersLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardHeader>
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-8" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
