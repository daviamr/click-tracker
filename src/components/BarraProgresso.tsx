"use client"

import { Progress } from "@/components/ui/progress"

interface BarraProgressoProps {
  value: number;
}

export function BarraProgresso({ value }: BarraProgressoProps) {
  return <Progress value={value} />
}
