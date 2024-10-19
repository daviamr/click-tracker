import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectUTM() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="utm_source">utm_source</SelectItem>
            <SelectItem value="utm_medium">utm_medium</SelectItem>
            <SelectItem value="utm_campaign">utm_campaign</SelectItem>
            <SelectItem value="utm_turn">utm_turn</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  