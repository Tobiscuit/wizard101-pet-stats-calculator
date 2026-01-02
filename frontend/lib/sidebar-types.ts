import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  items?: {
    title: string
    url: string
  }[]
}

export interface SidebarConfig {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: NavItem[]
  navSecondary: NavItem[]
}
