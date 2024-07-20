import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectConversor() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o conversor" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Campanhas</SelectLabel>
            <SelectItem value="conversor1">Conversor1</SelectItem>
            <SelectItem value="conversor2">Conversor2</SelectItem>
            <SelectItem value="conversor3">Conversor3</SelectItem>
            <SelectItem value="conversor4">Conversor4</SelectItem>
            <SelectItem value="conversor5">Conversor5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  