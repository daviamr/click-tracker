import { AlertMessage } from "@/components/alert_message";
import { NovaAcao } from "@/components/Modal/NovaAcao";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hook/Auth";
import { useContextState } from "@/hook/state";
import { dataAction, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { CircleArrowLeft, CircleX } from "lucide-react";
import { useEffect, useState } from "react";

type dataActionProps = {data: DataProps}

export function AcaoPage() {
    const {data} = useAuth() as dataActionProps
  const [dataAction, setAction] = useState<dataAction[]>([])
  const { setIsFocus } = useContextState();

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/actions',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setAction(response.data)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as ações, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }
  handleGetUsers()
},[])
console.log(dataAction)

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Ação</h1>
        <Button
          onClick={() => setIsFocus("campaign")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovaAcao />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="min-w-[100px]">Cliente</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="flex items-center justify-end gap-2">
              <div></div>
              <Button
                className="p-2 duration-300 hover:text-red-700"
                variant={"outline"}
              >
                <CircleX size={18} />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
