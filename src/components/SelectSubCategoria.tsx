import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectSubCategoria() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a subcategoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Subcategorias</SelectLabel>
            <SelectItem value="1">Maquininha</SelectItem>
            <SelectItem value="2">Abertura de Contas</SelectItem>
            <SelectItem value="3">Empréstimos</SelectItem>
            <SelectItem value="4">Cartão de Crédito</SelectItem>
            <SelectItem value="5">Software</SelectItem>
            <SelectItem value="6">Cartão Alimentação</SelectItem>
            <SelectItem value="7">Cartão Refeição</SelectItem>
            <SelectItem value="8">Plano de Saúde</SelectItem>
            <SelectItem value="9">Plano Odontológico</SelectItem>
            <SelectItem value="10">E-mail Marketing</SelectItem>
            <SelectItem value="11">Geração de Leads</SelectItem>
            <SelectItem value="12">Internet</SelectItem>
            <SelectItem value="13">Plano Móvel</SelectItem>
            <SelectItem value="14">Máquina de Café</SelectItem>
            <SelectItem value="15">Materal de Escritório</SelectItem>
            <SelectItem value="16">Antivírus</SelectItem>
            <SelectItem value="17">PCs e Notebooks</SelectItem>
            <SelectItem value="18">Mobiliários</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  