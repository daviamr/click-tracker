import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectModelo() {
    return (
      <Select>
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
            <SelectItem value="leadhunting">Lead Hunting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  