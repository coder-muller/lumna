import type { ReactNode } from "react"
import {
  BarChart3Icon,
  FileTextIcon,
  LayoutGridIcon,
  ReceiptTextIcon,
  UsersIcon,
} from "lucide-react"

export type SidebarNavItem = {
  title: string
  path?: string
  icon?: ReactNode
  isActive?: boolean
  subItems?: SidebarNavItem[]
}

export type SidebarNavGroup = {
  label: string
  items: SidebarNavItem[]
}

const baseNavGroups: SidebarNavGroup[] = [
  {
    label: "Visão Geral",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutGridIcon />,
      },
      {
        title: "Relatórios",
        path: "/reports",
        icon: <BarChart3Icon />,
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        title: "Cobranças",
        path: "/invoices",
        icon: <ReceiptTextIcon />,
      },
      {
        title: "Clientes",
        path: "/customers",
        icon: <UsersIcon />,
      },
    ],
  },
]

function isPathActive(pathname: string, path?: string) {
  if (!path || path.startsWith("#")) {
    return false
  }

  return pathname === path || pathname.startsWith(`${path}/`)
}

function resolveNavItem(
  item: SidebarNavItem,
  pathname: string
): SidebarNavItem {
  const subItems = item.subItems?.map((subItem) =>
    resolveNavItem(subItem, pathname)
  )
  const isActive =
    isPathActive(pathname, item.path) ||
    !!subItems?.some((subItem) => subItem.isActive)

  return {
    ...item,
    isActive,
    subItems,
  }
}

export function getNavGroups(pathname: string): SidebarNavGroup[] {
  return baseNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => resolveNavItem(item, pathname)),
  }))
}

export function getNavLinks(pathname: string): SidebarNavItem[] {
  return [
    ...getNavGroups(pathname).flatMap((group) =>
      group.items.flatMap((item) =>
        item.subItems?.length ? [item, ...item.subItems] : [item]
      )
    ),
  ]
}

export const pageIcons = {
  dashboard: <LayoutGridIcon />,
  reports: <BarChart3Icon />,
  invoices: <ReceiptTextIcon />,
  customers: <UsersIcon />,
  account: <FileTextIcon />,
}
