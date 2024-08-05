import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useAuth } from "@/hook/Auth";
import { conversorData, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AlertMessage } from "./alert_message";

type dataConversorProps = {data: DataProps}
  
  export function SelectConversor() {
    const [conversor, setConversor] = useState<conversorData[]>([]);
    const { data } = useAuth() as dataConversorProps
  
    useEffect(() => {
      async function handleGetUsers()
      {
      try {
        const response = await api.get('/alphabets',
          {headers: {
          "Authorization": `Bearer ${data.jwtToken}`,
        }})
        setConversor(response.data)
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar os conversores, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers()
  },[conversor])

    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o conversor" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Conversores</SelectLabel>
            {conversor.map((i, index) => (
            <SelectItem value={i.name} key={index}>{i.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  