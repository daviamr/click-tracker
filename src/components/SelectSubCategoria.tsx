import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  type subCategoryProps = {
    defaultValue?: string;
  }
  
  export function SelectSubCategoria({defaultValue}: subCategoryProps) {
    return (
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a subcategoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Subcategorias</SelectLabel>
            <SelectItem value="maquininha">Maquininha</SelectItem>
            <SelectItem value="abertura de contas">Abertura de Contas</SelectItem>
            <SelectItem value="empréstimos">Empréstimos</SelectItem>
            <SelectItem value="cartão de crédito">Cartão de Crédito</SelectItem>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="cartão alimentação">Cartão Alimentação</SelectItem>
            <SelectItem value="cartão refeição">Cartão Refeição</SelectItem>
            <SelectItem value="plano de saúde">Plano de Saúde</SelectItem>
            <SelectItem value="plano odontológico">Plano Odontológico</SelectItem>
            <SelectItem value="e-mail marketing">E-mail Marketing</SelectItem>
            <SelectItem value="geração de leads">Geração de Leads</SelectItem>
            <SelectItem value="internet">Internet</SelectItem>
            <SelectItem value="plano móvel">Plano Móvel</SelectItem>
            <SelectItem value="máquina de café">Máquina de Café</SelectItem>
            <SelectItem value="material de escritório">Material de Escritório</SelectItem>
            <SelectItem value="antivírus">Antivírus</SelectItem>
            <SelectItem value="pcs e notebooks">PCs e Notebooks</SelectItem>
            <SelectItem value="mobiliários">Mobiliários</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  