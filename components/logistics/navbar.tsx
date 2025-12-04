"use client"

import * as React from "react"
import { User, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lever
            </span>
          </div>
        </div>

        {/* Avatar with Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border transition-all hover:ring-primary">
                <AvatarImage src="/api/placeholder/40/40" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  OP
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Operator</p>
                <p className="text-xs text-muted-foreground">operator@lever.com</p>
              </div>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                size="sm"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  )
}

