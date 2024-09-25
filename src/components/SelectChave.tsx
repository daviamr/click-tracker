import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectChave() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="instagram">instagram</SelectItem>
            <SelectItem value="inbound">inbound</SelectItem>
            <SelectItem value="google">google</SelectItem>
            <SelectItem value="emkt">emkt</SelectItem>
            <SelectItem value="emkt">facebook</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  