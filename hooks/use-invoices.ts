"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import type { Invoice, InvoiceStatus } from "@/lib/db/schema"

import { getInvoices } from "@/server/invoices/get-invoices"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"
import { createInvoice } from "@/server/invoices/create-invoice"
import { cancelInvoice } from "@/server/invoices/cancel-invoice"

import type { InvoiceFormInput } from "@/server/invoices/invoice-schema"

export const invoicesKeys = {
  all: ["invoices"] as const,
}

type GetInvoicesRequest = {
  page?: number
  limit?: number
  search?: string
  status?: InvoiceStatus
}

type GetInvoicesResponse = {
  data: InvoiceWithCustomer[]
  total: number
  page: number
  limit: number
}

type CreateInvoiceResponse = {
  data: Invoice
}

type CancelInvoiceResponse = {
  data: Invoice
}

const getInvoicesAction = async (
  data: GetInvoicesRequest
): Promise<GetInvoicesResponse> => {
  const response = await getInvoices({
    page: data.page ?? 1,
    limit: data.limit ?? 6,
    search: data.search ?? "",
    status: data.status,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return {
    data: response.data,
    total: response.total,
    page: data.page ?? 1,
    limit: data.limit ?? 6,
  }
}

const createInvoiceAction = async (
  data: InvoiceFormInput
): Promise<CreateInvoiceResponse> => {
  const response = await createInvoice(data)

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

const cancelInvoiceAction = async (
  invoiceId: string
): Promise<CancelInvoiceResponse> => {
  const response = await cancelInvoice({
    id: invoiceId,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

export const useInvoices = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<InvoiceStatus | undefined>(undefined)

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
    error: errorInvoices,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["invoices", page, limit, search, status],
    queryFn: () =>
      getInvoicesAction({
        page,
        limit,
        search,
        status,
      }),
    refetchInterval: 60_000,
  })

  const createInvoiceMutation = useMutation({
    mutationFn: createInvoiceAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      })
    },
  })

  const cancelInvoiceMutation = useMutation({
    mutationFn: cancelInvoiceAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      })
    },
  })

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setLimit(limit)
    setPage(1)
  }

  const handleSearchChange = (search: string) => {
    setSearch(search)
    setPage(1)
  }

  const handleStatusChange = (status: InvoiceStatus | undefined) => {
    setStatus(status)
    setPage(1)
  }

  const hasInvoices = (invoices?.data.length || 0) > 0

  const totalPages = Math.ceil((invoices?.total || 0) / (invoices?.limit || 1))

  const hasNextPage = (invoices?.page || 0) < totalPages
  const hasPreviousPage = (invoices?.page || 0) > 1

  return {
    invoices,
    isLoadingInvoices,
    isFetchingInvoices,
    errorInvoices,
    refetchInvoices,

    createInvoiceMutation,
    cancelInvoiceMutation,

    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleStatusChange,

    hasInvoices,
    totalPages,
    hasNextPage,
    hasPreviousPage,

    page,
    limit,
    search,
    status,
  }
}
