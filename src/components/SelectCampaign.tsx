import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectCampanha() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione a campanha" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Campanhas</SelectLabel>
          <SelectItem value="campanha1">Campanha1</SelectItem>
          <SelectItem value="campanha2">Campanha2</SelectItem>
          <SelectItem value="campanha3">Campanha4</SelectItem>
          <SelectItem value="campanha4">Campanha5</SelectItem>
          <SelectItem value="campanha5">Campanha6</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
