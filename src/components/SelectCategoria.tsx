import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  type categoryProps = {
    defaultValue?: string;
  }
  
  export function SelectCategoria({defaultValue}: categoryProps) {
    return (
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorias</SelectLabel>
            <SelectItem value="financeiro">Financeiro</SelectItem>
            <SelectItem value="benefícios">Benefícios</SelectItem>
            <SelectItem value="saúde">Saúde</SelectItem>
            <SelectItem value="publicidade">Publicidade</SelectItem>
            <SelectItem value="telecom">Telecom</SelectItem>
            <SelectItem value="facilities">Facilities</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="escritorio">Escritório</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  