import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipProps {
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    content: string;
}

export function TooltipDemo({side, align, content}: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="p-0 w-6 h-6 bg-background rounded-full text-xs font-bold relative top-[-4px]" aria-label="Help">?</Button>
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="max-w-[260px]">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
