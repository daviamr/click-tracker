import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hook/Auth"
import { campaignData, DataProps } from "@/interface/auth"
import { api } from "@/services/Api"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { AlertMessage } from "./alert_message"

type dataSelectCampaignProps = {data: DataProps}

export function SelectCampanha() {
  const {data} = useAuth() as dataSelectCampaignProps;
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/campaigns',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setCampanhas(response.data)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as campanhas, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }
  handleGetUsers()
},[campanhas]);

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a campanha" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Campanhas</SelectLabel>
          {campanhas.map((i, index) => (
          <SelectItem value={i.name} key={index}>{i.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
