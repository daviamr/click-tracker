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
import { dataAction, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { FileX2, RefreshCw, Waypoints } from "lucide-react";
import { useEffect, useState } from "react";

type dataActionProps = { data: DataProps };

export function AcaoPage() {
  const { data } = useAuth() as dataActionProps;
  const { deleteAction, handleStatusAction } = useAuth();
  const [dataAction, setAction] = useState<dataAction[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const formatCost = (cost: number) => {
    return `R$ ${cost.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSwitchChange = async (id: number, checked: boolean) => {
    setSwitchStates((prev) => ({ ...prev, [id]: checked }));

    await handleStatusAction({ id });
    console.log(`Valor do Switch para ação ${id}:`, checked);
    await handleGetAction();
  };

  const handleGetAction = async () => {
    try {
      const response = await api.get("/actions", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setAction(response.data);

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
  };
  useEffect(() => {
    handleGetAction();
  }, [data.jwtToken]);

  /* deletar Ação */
  const handleDeleteCampaign = async (id: number) => {
    await deleteAction({ id });
    handleGetAction();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetAction();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Waypoints size={30} className="animate-pulse" />
          Ações
        </h1>
      </div>
      <div className="flex justify-between items-center border-solid border-y-[1px] py-2 px-4">
        <div className="flex gap-2 dark:bg-slate-900 bg-slate-200 p-2 rounded-lg">
          <p className="flex itemns-center gap-2 text-xs">
            <span className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></span>
            Ativo
          </p>
          <p className="flex itemns-center gap-2 text-xs">
            <span className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></span>
            Pausado
          </p>
          <p className="flex itemns-center gap-2 text-xs">
            <span className="w-4 h-4 bg-orange-600 rounded-full animate-pulse"></span>{" "}
            Agendado
          </p>
          <p className="flex itemns-center gap-2 text-xs">
            <span className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></span>{" "}
            Desativado
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex gap-2"
            variant={"secondary"}
            onClick={refresh}
            disabled={!!refreshStatus}
          >
            <RefreshCw
              size={18}
              className={`${refreshStatus && "animate-spin"}`}
            />
            Atualizar
          </Button>
          <NovaAcao onCreateAction={handleGetAction} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="pl-4">Status</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead className="min-w-[100px]">Cliente</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>LP</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Display</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataAction.map((i) => {
            const dataFormatada = (data: string) => {
              return new Date(data).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
            };
            return (
              <TableRow key={i.id}>
                <TableCell className="pl-4">
                  {i.status === "Active" && (
                    <p className="flex itemns-center gap-2 text-xs">
                      <span className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></span>
                    </p>
                  )}
                  {i.status === "Paused" && (
                    <p className="flex itemns-center gap-2 text-xs">
                      <span className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></span>
                    </p>
                  )}
                  {i.status === "Scheduled" && (
                    <p className="flex itemns-center gap-2 text-xs">
                      <span className="w-4 h-4 bg-orange-600 rounded-full animate-pulse"></span>
                    </p>
                  )}
                  {i.status === "Inactive" && (
                    <p className="flex itemns-center gap-2 text-xs">
                      <span className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></span>
                    </p>
                  )}
                </TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.clientName}</TableCell>
                <TableCell>{i.campaignName}</TableCell>
                <TableCell>{i.landingPageName}</TableCell>
                <TableCell>{formatCost(i.cost)}</TableCell>
                <TableCell>{i.media}</TableCell>
                <TableCell>{i.totalClicks}</TableCell>
                <TableCell>{i.totalLinks}</TableCell>
                <TableCell>{dataFormatada(i.startAt)}</TableCell>
                <TableCell>{dataFormatada(i.endAt)}</TableCell>
                <TableCell className="flex items-center justify-end gap-2 pr-4">
                  <Switch
                    value={i.id}
                    checked={switchStates[i.id] || false}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(i.id, checked)
                    }
                  />
                  <EditarAcao
                    id={i.id}
                    client={i.clientName}
                    action={i.name}
                    campaign={i.campaignName}
                    cost={i.cost}
                    lp={i.landingPageName}
                    dataInicio={i.startAt}
                    dataFim={i.endAt}
                    media={i.media}
                    onEditAction={handleGetAction}
                  />
                  <Button
                    className="p-2 duration-300 hover:text-red-700"
                    variant={"outline"}
                    onClick={() => handleDeleteCampaign(i.id)}
                  >
                    <FileX2 size={18} />
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
