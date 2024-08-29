import { AlertMessage } from "@/components/alert_message";
import { EditarAcao } from "@/components/Modal/EditarAcao";
import { NovaAcao } from "@/components/Modal/NovaAcao";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  const {deleteAction, handleStatusAction} = useAuth();
  const [dataAction, setAction] = useState<dataAction[]>([])
  const { setIsFocus } = useContextState();
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleSwitchChange = (id: number, checked: boolean) => {
    setSwitchStates((prev) => ({ ...prev, [id]: checked }));

    handleStatusAction({id})
    console.log(`Valor do Switch para ação ${id}:`, checked);
  };

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/actions',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setAction(response.data)

      // Inicializa o estado dos switches com base no status das ações
      const initialSwitchStates: { [key: number]: boolean } = {};
      response.data.forEach((action: dataAction) => {
        // Switch marcado apenas se o status for 'Active'
        initialSwitchStates[action.id] = action.status === "Active";
      });

      setSwitchStates(initialSwitchStates);
      
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
},[dataAction])

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
            <TableHead>Status</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead className="min-w-[100px]">Cliente</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Personalização URL</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {dataAction.map(i => {
              const dataFormatada = (data: string) => {
                return new Date(data).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                })
              }      
            return (
          <TableRow key={i.id}>
            <TableCell>
              {i.status === 'Active' ?
                <p className="flex itemns-center gap-2 text-xs">
                <span
                className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></span>
                {i.status}
              </p>
              : 
              <p className="flex itemns-center gap-2 text-xs">
                <span
                className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></span>
                {i.status}
              </p>}
            </TableCell>
            <TableCell>{i.name}</TableCell>
            <TableCell>{i.campaign.client.name}</TableCell>
            <TableCell>{i.campaign.name}</TableCell>
            <TableCell>{i.customPath ? i.customPath: '/' }</TableCell>
            <TableCell>{i.totalClicks}</TableCell>
            <TableCell>{i.totalLinks}</TableCell>
            <TableCell>{dataFormatada(i.startAt)}</TableCell>
            <TableCell>{dataFormatada(i.endAt)}</TableCell>
            <TableCell className="flex items-center justify-end gap-2">
              <Switch
              value={i.id}
              checked={switchStates[i.id] || false}
              onCheckedChange={(checked) =>
              handleSwitchChange(i.id, checked)
              }/>
              <EditarAcao id={i.id} cliente={i.campaign.client.name} campanha={i.campaign.name} acao={i.name} dataInicio={i.startAt} dataFim={i.endAt}/>
              <Button
                className="p-2 duration-300 hover:text-red-700"
                variant={"outline"}
                onClick={() => deleteAction({id: i.id})}
              >
                <CircleX size={18} />
              </Button>
            </TableCell>
          </TableRow>
            );
            })}
        </TableBody>
      </Table>
    </>
  );
}
