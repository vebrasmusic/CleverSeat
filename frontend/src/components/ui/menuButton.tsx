"use client"

import * as React from "react"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export function MenuButton({children, tooltipText, onClick}: {children: React.ReactNode, tooltipText: string, onClick?: () => void}) {

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="w-full bg-transparent">
          <Button className="w-full bg-transparent p-[6px]" variant="outline" onClick={onClick} asChild>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}