import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft, FileX2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { NovaCampanha } from "@/components/Modal/NovaCampanha";
import { EditarCampanha } from "@/components/Modal/EditarCampanha";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { campaignData, DataProps } from "@/interface/auth";

type dataCampaignProps = {data: DataProps}

export function CampanhaPage() {
  const { setIsFocus } = useContextState();
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const { data } = useAuth() as dataCampaignProps

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
},[campanhas])

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Cadastrar campanha</h1>
        <Button
          onClick={() => setIsFocus("customers")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovaCampanha />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="w-[120px]">Campanha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campanhas.map((i, index) => (
            <TableRow key={index}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.Client.name}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarCampanha id={i.id} nameClient={i.Client.name} />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  // onClick={() => removeCampaign(i.id)}
                >
                  <FileX2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
