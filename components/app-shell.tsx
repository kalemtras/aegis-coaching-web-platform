'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Activity,
  Calendar,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { athlete, currentMetric } from '@/lib/mock-data'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/goals', label: 'Goals & Plan', icon: Target },
  { href: '/analysis', label: 'Analysis', icon: TrendingUp },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="size-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm font-semibold tracking-tight text-sidebar-foreground">
              APEX
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Coaching Engine
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <item.icon className="size-4.5" strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent font-mono text-xs font-semibold text-accent-foreground">
              MK
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-medium text-sidebar-foreground">
                {athlete.name}
              </div>
              <div className="truncate font-mono text-xs text-muted-foreground">
                CTL {Math.round(currentMetric.ctl)} · FTP {athlete.ftp}w
              </div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            {theme === 'dark' ? (
              <Sun className="size-4.5" strokeWidth={2} />
            ) : (
              <Moon className="size-4.5" strokeWidth={2} />
            )}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-foreground hover:bg-accent"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-mono text-sm font-semibold">APEX</span>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
