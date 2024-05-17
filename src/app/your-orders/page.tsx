import Link from "next/link"
import { notFound } from "next/navigation"

import { db } from "@/db"
import { env } from "@/env.mjs"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { OrderStatus } from "@prisma/client"

import { formatPrice } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import PhonePreview from "@/components/phone-preview"

const Page = async () => {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

  const ADMIN_EMAIL = env.ADMIN_EMAIL

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound()
  }

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      shippingAddress: true,
      configuration: true,
    },
  })

  return (
    <div className="lg: flex min-h-screen w-full bg-muted/40 p-4 lg:p-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <h1 className="text-4xl font-bold tracking-tight">Your orders</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Img</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchase date
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <PhonePreview
                      croppedImageUrl={order.configuration.croppedImageUrl!}
                      color={order.configuration.color!}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="me-2 rounded border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-gray-700 dark:text-yellow-300">
                      {getOrderStatusText(order.status)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/your-orders/${order.id}`}
                      className="text-sm font-medium underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
export default Page

const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.fulfilled:
      return "Order Fulfilled"
    case OrderStatus.shipped:
      return "Order Shipped"
    case OrderStatus.awaiting_shipment:
      return "Awaiting Shipment"
    default:
      return "Unknown Status"
  }
}
