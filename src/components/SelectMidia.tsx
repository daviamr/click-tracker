import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  type midiaProps = {
    defaultValue?: string;
  }
  
  export function SelectMidia({defaultValue}: midiaProps) {
    return (
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Modelos</SelectLabel>
            <SelectItem value="Mail mkt">Mail mkt</SelectItem>
            <SelectItem value="Push">Push</SelectItem>
            <SelectItem value="Display">Display</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="Whatsapp">Whatsapp</SelectItem>
            <SelectItem value="Native">Native</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  