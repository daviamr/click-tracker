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
    className?: string;
}

export function TooltipHeader({side, align, content, className}: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <span className={`p-0 w-4 h-4 bg-transparent text-[10px] font-bold  border-none ${className}`} aria-label="Help"></span>
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="max-w-[260px]">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
