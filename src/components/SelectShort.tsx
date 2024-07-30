import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectEncurtador() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a Short URL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecione a URL</SelectLabel>
            <SelectItem value="shortener">Shortener</SelectItem>
            <SelectItem value="lorem">lorem</SelectItem>
            <SelectItem value="lorem">lorem</SelectItem>
            <SelectItem value="lorem">lorem</SelectItem>
            <SelectItem value="lorem">lorem</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  