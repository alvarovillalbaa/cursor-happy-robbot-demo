"use client"

import * as React from "react"
import { ArrowRight, Clock, Package, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type UseCaseType = "delays" | "where-is-box" | "operational-logistics"

export interface UseCaseCardProps {
  type: UseCaseType
  onClick: () => void
  className?: string
}

const useCaseConfig: Record<
  UseCaseType,
  {
    title: string
    description: string
    icon: React.ReactNode
    gradient: string
    iconBg: string
  }
> = {
  delays: {
    title: "Delays",
    description: "Track delays for warehouses and routes. Get real-time updates on shipments and deliveries.",
    icon: <Clock className="h-6 w-6" />,
    gradient: "from-orange-500 to-red-500",
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  "where-is-box": {
    title: "Where is a Box?",
    description: "Locate any box across tracks, routes, or warehouses. Instant location tracking and status updates.",
    icon: <Package className="h-6 w-6" />,
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  "operational-logistics": {
    title: "Operational Logistics",
    description: "View incoming and outgoing routes, track boxes in transit, and manage logistics operations.",
    icon: <Truck className="h-6 w-6" />,
    gradient: "from-indigo-500 to-purple-500",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
}

export function UseCaseCard({ type, onClick, className }: UseCaseCardProps) {
  const config = useCaseConfig[type]

  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
        "hover:scale-[1.02] active:scale-[0.98]",
        "bg-card/50 backdrop-blur-sm",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10",
          config.gradient
        )}
      />
      
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              config.iconBg
            )}
          >
            {config.icon}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <CardTitle className="mt-4 text-xl">{config.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Click to start voice assistant</span>
        </div>
      </CardContent>
    </Card>
  )
}

