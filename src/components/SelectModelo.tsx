import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  type modelProps = {
    defaultValue?: string;
  }
  
  export function SelectModelo({defaultValue}: modelProps) {
    return (
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o modelo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Modelos</SelectLabel>
            <SelectItem value="cpl">CPL</SelectItem>
            <SelectItem value="cpi">CPI</SelectItem>
            <SelectItem value="cpa">CPA</SelectItem>
            <SelectItem value="cpc">CPC</SelectItem>
            <SelectItem value="lead hunting">Lead Hunting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  