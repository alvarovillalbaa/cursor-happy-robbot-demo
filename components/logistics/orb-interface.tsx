"use client"

import * as React from "react"
import { ArrowLeft, Phone, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Orb, type AgentState } from "@/components/ui/orb"
import { useCaseConfig, type UseCaseType } from "./use-case-card"
import { cn } from "@/lib/utils"

interface OrbInterfaceProps {
  useCase: UseCaseType
  onBack: () => void
}

export function OrbInterface({ useCase, onBack }: OrbInterfaceProps) {
  const [agentState, setAgentState] = React.useState<AgentState>(null)
  const [isCallActive, setIsCallActive] = React.useState(false)
  const inputVolumeRef = React.useRef<number>(0)
  const outputVolumeRef = React.useRef<number>(0)

  const config = useCaseConfig[useCase]

  const handleStartCall = () => {
    // Initiate phone call to the AI agent
    const phoneNumber = "+34911676409" // +34 911 67 64 09
    window.location.href = `tel:${phoneNumber}`
    
    setIsCallActive(true)
    setAgentState("listening")
    // Simulate voice interaction
    setTimeout(() => {
      setAgentState("talking")
      setTimeout(() => {
        setAgentState("thinking")
        setTimeout(() => {
          setAgentState("listening")
        }, 2000)
      }, 3000)
    }, 1000)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setAgentState(null)
  }

  // Simulate volume changes based on agent state
  React.useEffect(() => {
    if (!isCallActive) {
      inputVolumeRef.current = 0
      outputVolumeRef.current = 0.3
      return
    }

    const interval = setInterval(() => {
      if (agentState === "listening") {
        inputVolumeRef.current = 0.4 + Math.random() * 0.4
        outputVolumeRef.current = 0.3
      } else if (agentState === "talking") {
        inputVolumeRef.current = 0.2
        outputVolumeRef.current = 0.5 + Math.random() * 0.4
      } else if (agentState === "thinking") {
        inputVolumeRef.current = 0.2 + Math.random() * 0.2
        outputVolumeRef.current = 0.3 + Math.random() * 0.2
      }
    }, 100)

    return () => clearInterval(interval)
  }, [agentState, isCallActive])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                config.iconBg
              )}
            >
              {config.icon}
            </div>
            <div>
              <h2 className="text-sm font-semibold">{config.title}</h2>
              <p className="text-xs text-muted-foreground">Voice Assistant</p>
            </div>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gradient-to-b from-background to-muted/20">
        <div className="flex w-full max-w-4xl flex-col items-center gap-8 animate-in fade-in duration-500">
          {/* Orb Container */}
          <div className="relative h-[500px] w-full max-w-[500px] animate-in zoom-in-95 duration-700">
            <Orb
              agentState={agentState}
              volumeMode="manual"
              inputVolumeRef={inputVolumeRef}
              outputVolumeRef={outputVolumeRef}
              colors={getColorsForUseCase(useCase)}
              className="h-full w-full"
            />
          </div>

          {/* Status Text */}
          <div className="text-center">
            {!isCallActive ? (
              <>
                <h3 className="text-2xl font-semibold mb-2">
                  Ready to assist
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Click the button below to start your voice conversation about{" "}
                  {config.title.toLowerCase()}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-2">
                  {agentState === "listening" && "Listening..."}
                  {agentState === "talking" && "Speaking..."}
                  {agentState === "thinking" && "Processing..."}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {agentState === "listening" &&
                    "Ask your question about " + config.title.toLowerCase()}
                  {agentState === "talking" &&
                    "The assistant is providing information..."}
                  {agentState === "thinking" &&
                    "Analyzing your request..."}
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isCallActive ? (
              <Button
                size="lg"
                onClick={handleStartCall}
                className={cn(
                  "gap-2 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl",
                  getGradientClass(useCase)
                )}
              >
                <Phone className="h-5 w-5" />
                Start Call
              </Button>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                onClick={handleEndCall}
                className="gap-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getColorsForUseCase(useCase: UseCaseType): [string, string] {
  switch (useCase) {
    case "delays":
      return ["#fb923c", "#f87171"] // orange to red
    case "where-is-box":
      return ["#3b82f6", "#06b6d4"] // blue to cyan
    case "operational-logistics":
      return ["#6366f1", "#a855f7"] // indigo to purple
    default:
      return ["#CADCFC", "#A0B9D1"]
  }
}

function getGradientClass(useCase: UseCaseType): string {
  switch (useCase) {
    case "delays":
      return "bg-gradient-to-r from-orange-500 to-red-500"
    case "where-is-box":
      return "bg-gradient-to-r from-blue-500 to-cyan-500"
    case "operational-logistics":
      return "bg-gradient-to-r from-indigo-500 to-purple-500"
    default:
      return "bg-gradient-to-r from-blue-500 to-indigo-500"
  }
}

