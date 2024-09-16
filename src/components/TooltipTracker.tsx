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

export function TooltipTracker({side, align, content}: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button variant="outline" className="p-0 w-4 h-4 bg-background rounded-full text-[10px] font-bold relative top-[-2px] right-[-3px]" aria-label="Help">?</Button>
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="max-w-[260px]">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
