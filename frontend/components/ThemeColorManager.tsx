"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeColorManager() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    const themeColor = resolvedTheme === "dark" ? "#11222a" : "#fdf6e3"

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColor)
    } else {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = themeColor
      document.head.appendChild(meta)
    }
  }, [resolvedTheme])

  return null
}
