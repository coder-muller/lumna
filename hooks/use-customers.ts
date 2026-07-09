"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import type { Customer } from "@/lib/db/schema"

import { getCustomers } from "@/server/customers/get-customers"
import { createCustomer } from "@/server/customers/create-customer"
import { updateCustomer } from "@/server/customers/update-customer"
import { resyncCustomer } from "@/server/customers/resync-customer"
import { deleteCustomer } from "@/server/customers/delete-customer"

import type {
  CustomerFormInput,
  UpdateCustomerInput,
} from "@/server/customers/customer-schema"

export const customersKeys = {
  all: ["customers"] as const,
}

type GetCustomersRequest = {
  page?: number
  limit?: number
  search?: string
}

type DeleteCustomerResponse = {
  success: true
}

type GetCustomersResponse = {
  data: Customer[]
  total: number
  page: number
  limit: number
}

type CreateCustomerResponse = {
  data: Customer
}

type UpdateCustomerResponse = {
  data: Customer
}

type ResyncCustomerResponse = {
  data: Customer
}

const getCustomersAction = async (
  data: GetCustomersRequest
): Promise<GetCustomersResponse> => {
  const response = await getCustomers({
    page: data.page ?? 1,
    limit: data.limit ?? 6,
    search: data.search ?? "",
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

const createCustomerAction = async (
  data: CustomerFormInput
): Promise<CreateCustomerResponse> => {
  const response = await createCustomer(data)

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

const updateCustomerAction = async (
  data: UpdateCustomerInput
): Promise<UpdateCustomerResponse> => {
  const response = await updateCustomer(data)

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

const resyncCustomerAction = async (
  customerId: string
): Promise<ResyncCustomerResponse> => {
  const response = await resyncCustomer({
    id: customerId,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

const deleteCustomerAction = async (
  customerId: string
): Promise<DeleteCustomerResponse> => {
  const response = await deleteCustomer({
    id: customerId,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response.data
}

export const useCustomers = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [search, setSearch] = useState("")

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    error: errorCustomers,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", page, limit, search],
    queryFn: () =>
      getCustomersAction({
        page,
        limit,
        search,
      }),
  })

  const createCustomerMutation = useMutation({
    mutationFn: createCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      })
    },
  })

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomerAction,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      })
    },
  })

  const resyncCustomerMutation = useMutation({
    mutationFn: resyncCustomerAction,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      })
    },
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
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

  const hasCustomers = (customers?.data.length || 0) > 0

  const totalPages = Math.ceil(
    (customers?.total || 0) / (customers?.limit || 1)
  )

  const hasNextPage = (customers?.page || 0) < totalPages
  const hasPreviousPage = (customers?.page || 0) > 1
  const hasMoreThanTenCustomers = (customers?.total || 0) > 10

  return {
    customers,
    isLoadingCustomers,
    isFetchingCustomers,
    errorCustomers,
    refetchCustomers,

    createCustomerMutation,
    updateCustomerMutation,
    resyncCustomerMutation,
    deleteCustomerMutation,

    handlePageChange,
    handleLimitChange,
    handleSearchChange,

    hasCustomers,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    hasMoreThanTenCustomers,

    page,
    limit,
    search,
  }
}
