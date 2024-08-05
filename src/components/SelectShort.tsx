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
import { DataProps, selectShortUrl } from "@/interface/auth";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AlertMessage } from "./alert_message";
import { api } from "@/services/Api";

type dataSelectShortProps = {data: DataProps}
  
  export function SelectEncurtador() {
    const {data} = useAuth() as dataSelectShortProps;
    const [url, setUrl] = useState<selectShortUrl[]>([])

    useEffect(() => {
      async function handleGetUsers()
      {
      try {
        const response = await api.get('/base-url',
          {headers: {
          "Authorization": `Bearer ${data.jwtToken}`,
        }})
        setUrl(response.data)
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as URLs, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers()
  },[url])

    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a Short URL" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecione a URL</SelectLabel>
            <SelectItem value="shortener">Shortener</SelectItem>
            {url.map((i, index) => (
            <SelectItem value={i.url} key={index}>{i.url}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
  