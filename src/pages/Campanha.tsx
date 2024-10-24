import { Button } from "@/components/ui/button";
import { FileX2, Megaphone } from "lucide-react";
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
import { campaignData, customerData, DataProps } from "@/interface/auth";
import { Switch } from "@/components/ui/switch";

type dataCampaignProps = { data: DataProps };

export function CampanhaPage() {
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const { deleteCampaign, handleStatusCampaign } = useAuth();
  const { data } = useAuth() as dataCampaignProps;
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleSwitchChange = async (id: number, checked: boolean) => {
    setSwitchStates((prev) => ({ ...prev, [id]: checked }));

    await handleStatusCampaign({ id });
    await handleGetCampaign();
  };

  const handleGetCampaign = async () => {
    try {
      const response = await api.get("/campaigns", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCampanhas(response.data);

      const initialSwitchStates: { [key: number]: boolean } = {};
      response.data.forEach((campaign: campaignData) => {
        // Switch marcado apenas se o status for 'Active'
        initialSwitchStates[campaign.id] = campaign.status === "Active";
      });

      setSwitchStates(initialSwitchStates);
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
  };
  useEffect(() => {
    handleGetCampaign();
  }, [data.jwtToken]);

  const handleGetClient = async () => {
    try {
      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomerData(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os clientes, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetClient();
  }, [data.jwtToken]);

  /* deletar campanha */
  const handleDeleteCampaign = async (id: number) => {
    await deleteCampaign({ id });
    handleGetCampaign();
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Megaphone size={30} className="animate-pulse" />
          Campanhas
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
        <NovaCampanha onCreateCampaign={handleGetCampaign} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="pl-4">Status</TableHead>
            <TableHead className="w-[200px]">Campanha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Subcategoria</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Payout</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campanhas.map((i, index) => {
            const customerName =
              customerData
                .filter((customer) => i.clientId === customer.id)
                .map((customer) => customer.name)
                .join(", ") || "Cliente não encontrado";
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
              <TableRow key={index}>
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
                <TableCell className="text-nowrap">{customerName}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell>{i.subCategory}</TableCell>
                <TableCell>{i.model === 'LeadHunting' ? 'Lead Hunting' : i.model}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.payout}</TableCell>
                <TableCell>{i.totalActions}</TableCell>
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
                  <EditarCampanha
                    name={i.name}
                    id={i.id}
                    nameClient={customerName}
                    category={i.category}
                    subcategory={i.subCategory}
                    model={i.model}
                    type={i.type}
                    payout={i.payout}
                    dataInicio={i.startAt}
                    dataFim={i.endAt}
                    obs={i.obs}
                    onEditCampaign={handleGetCampaign}
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
