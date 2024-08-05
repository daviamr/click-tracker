import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectAcao() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a ação" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecione a ação</SelectLabel>
            <SelectItem value="Ação1">Ação1</SelectItem>
            <SelectItem value="Ação2">Ação2</SelectItem>
            <SelectItem value="Ação3">Ação3</SelectItem>
            <SelectItem value="Ação4">Ação4</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  