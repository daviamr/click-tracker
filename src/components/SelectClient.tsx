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
import { customerData, DataProps } from "@/interface/auth";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AlertMessage } from "./alert_message";
import { api } from "@/services/Api";
  
  export function SelectCliente() {
    const {data} = useAuth() as DataProps
    const [customerData, setCustomerData] = useState<customerData[]>([]);
  
    useEffect(() => {
      async function handleGetUsers()
      {
      try {
        const response = await api.get('/clients',
          {headers: {
          "Authorization": `Bearer ${data.jwtToken}`,
        }})
        setCustomerData(response.data)
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível deletar uma conta agora, tente novamente mais tarde!",
            "error"
          );
        }
      }
    }
    handleGetUsers()
  },[])
  
    return (
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione o cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Clientes</SelectLabel>
            {customerData.map((i,index) => (
            <SelectItem value={i.name} key={index}>
              {i.name}
            </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  