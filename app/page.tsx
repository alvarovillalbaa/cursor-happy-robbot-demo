"use client"

import * as React from "react"
import { Navbar } from "@/components/logistics/navbar"
import { UseCaseCard, type UseCaseType } from "@/components/logistics/use-case-card"
import { OrbInterface } from "@/components/logistics/orb-interface"

export default function Home() {
  const [selectedUseCase, setSelectedUseCase] = React.useState<UseCaseType | null>(null)

  if (selectedUseCase) {
    return (
      <>
        <Navbar />
        <div className="pt-16">
          <OrbInterface
            useCase={selectedUseCase}
            onBack={() => setSelectedUseCase(null)}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Logistics Voice Assistant
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Track drivers, warehouse operators, and shipments across your supply chain with AI-powered voice assistance.
            </p>
          </div>

          {/* Use Case Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <UseCaseCard
                type="delays"
                onClick={() => setSelectedUseCase("delays")}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <UseCaseCard
                type="where-is-box"
                onClick={() => setSelectedUseCase("where-is-box")}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 md:col-span-2 lg:col-span-1">
              <UseCaseCard
                type="operational-logistics"
                onClick={() => setSelectedUseCase("operational-logistics")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
