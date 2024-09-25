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
            <SelectItem value="utmsource">utm_source</SelectItem>
            <SelectItem value="utmmedium">utm_medium</SelectItem>
            <SelectItem value="utmcampaign">utm_campaign</SelectItem>
            <SelectItem value="utmturn">utm_turn</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  