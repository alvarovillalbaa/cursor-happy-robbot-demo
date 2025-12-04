"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export default function CallPage() {
  const handleCall = () => {
    const phoneNumber = '+34911676409';
    window.location.href = `tel:${phoneNumber}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Call Phone</h1>
        <p className="text-muted-foreground">Click the button below to call +34911676409</p>
        <Button 
          onClick={handleCall}
          size="lg"
          className="text-lg px-8 py-6"
        >
          📞 Call Now
        </Button>
      </div>
    </div>
  )
}

