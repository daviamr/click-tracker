import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function SelectLP() {
    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a LP" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>LP's</SelectLabel>
            <SelectItem value="lp1">LP1</SelectItem>
            <SelectItem value="lp2">LP2</SelectItem>
            <SelectItem value="lp3">LP3</SelectItem>
            <SelectItem value="lp4">LP4</SelectItem>
            <SelectItem value="lp5">LP5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  