import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectTipo() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos</SelectLabel>
            <SelectItem value="b2b">B2B</SelectItem>
            <SelectItem value="b2c">B2C</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  