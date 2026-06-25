"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { Customers } from "@/lib/generated/prisma/client"

import { getCustomers } from "@/server/customers/get-customers"
import { createCustomer } from "@/server/customers/create-customer"
import { updateCustomer } from "@/server/customers/update-customer"
import { archiveCustomer } from "@/server/customers/archive-customer"
import { unarchiveCustomer } from "@/server/customers/unarchive-customer"
import { deleteCustomer } from "@/server/customers/delete-customer"

import type {
  CustomerFormInput,
  UpdateCustomerInput,
} from "@/server/customers/customer-schema"

// Request Types
type GetCustomersRequest = {
  page?: number
  limit?: number
  search?: string
  archived?: boolean
}

type DeleteCustomerResponse = {
  success: true
}

// Response Types
type GetCustomersResponse = {
  data: Customers[]
  total: number
  page: number
  limit: number
}

type CreateCustomerResponse = {
  data: Customers
}

type UpdateCustomerResponse = {
  data: Customers
}

type ArchiveCustomerResponse = {
  data: Customers
}

type UnarchiveCustomerResponse = {
  data: Customers
}

// Action Wrappers
const getCustomersAction = async (
  data: GetCustomersRequest
): Promise<GetCustomersResponse> => {
  const response = await getCustomers({
    page: data.page ?? 1,
    limit: data.limit ?? 10,
    search: data.search ?? "",
    archived: data.archived ?? false,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return {
    data: response.data,
    total: response.total,
    page: data.page ?? 1,
    limit: data.limit ?? 10,
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

const archiveCustomerAction = async (
  customerId: string
): Promise<ArchiveCustomerResponse> => {
  const response = await archiveCustomer({
    id: customerId,
  })

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

const unarchiveCustomerAction = async (
  customerId: string
): Promise<UnarchiveCustomerResponse> => {
  const response = await unarchiveCustomer({
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

// Main Hook
export const useCustomers = (initialArchived: boolean = false) => {
  const queryClient = useQueryClient()

  // States
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [archived, setArchived] = useState(initialArchived)

  // Queries
  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    error: errorCustomers,
  } = useQuery({
    queryKey: ["customers", page, limit, search, archived],
    queryFn: () =>
      getCustomersAction({
        page,
        limit,
        search,
        archived,
      }),
  })

  // Mutations
  const createCustomerMutation = useMutation({
    mutationFn: createCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })

  const archiveCustomerMutation = useMutation({
    mutationFn: archiveCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })

  const unarchiveCustomerMutation = useMutation({
    mutationFn: unarchiveCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
    },
  })

  // Handlers
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

  const handleArchivedChange = (archived: boolean) => {
    setArchived(archived)
    setPage(1)
  }

  // Computed Values
  const hasCustomers = (customers?.data.length || 0) > 0

  const totalPages = Math.ceil(
    (customers?.total || 0) / (customers?.limit || 1)
  )

  const hasNextPage = (customers?.page || 0) < totalPages
  const hasPreviousPage = (customers?.page || 0) > 1
  const hasMoreThanTenCustomers = (customers?.total || 0) > 10

  return {
    // Data
    customers,
    isLoadingCustomers,
    isFetchingCustomers,
    errorCustomers,

    // Mutations
    createCustomerMutation,
    updateCustomerMutation,
    archiveCustomerMutation,
    unarchiveCustomerMutation,
    deleteCustomerMutation,

    // Handlers
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    handleArchivedChange,

    // Computed Values
    hasCustomers,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    hasMoreThanTenCustomers,

    // States
    page,
    limit,
    search,
    archived,
  }
}
