import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectCliente() {
    return (
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione o cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Clientes</SelectLabel>
            <SelectItem value="cliente1">Cliente1</SelectItem>
            <SelectItem value="cliente2">Cliente2</SelectItem>
            <SelectItem value="cliente3">Cliente3</SelectItem>
            <SelectItem value="cliente4">Cliente4</SelectItem>
            <SelectItem value="cliente5">Cliente5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  