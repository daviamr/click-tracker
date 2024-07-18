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
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione a Short URL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecione o encurtador</SelectLabel>
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
  