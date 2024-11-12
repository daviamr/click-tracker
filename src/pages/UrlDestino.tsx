import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Braces, RefreshCw, UserRoundX } from "lucide-react";
import { NovaUrlDestino } from "@/components/Modal/NovaUrlDestino";
import { useEffect, useState } from "react";
import { DataProps, finalURLProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";
import { EditarUrlDestino } from "@/components/Modal/EditarUrlDestino";

type dataURLProps = { data: DataProps };

export function UrlDestinoPage() {
  const { data } = useAuth() as dataURLProps;
  const { deleteFinalUrl } = useAuth();
  const [finalURL, setFinalURL] = useState<finalURLProps[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);

  const handleGetFinalURL = async () => {
    try {
      const response = await api.get("/final-urls", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setFinalURL(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os usuários, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetFinalURL();
  }, [data.jwtToken]);

  const handleDeleteFinalUrl = async (id: number) => {
    await deleteFinalUrl({ id });
    handleGetFinalURL();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetFinalURL();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Braces size={30} className="animate-pulse" />
          URLs de Destino
        </h1>
      </div>
      <div className="flex gap-2 justify-end border-solid border-y-[1px] py-2 px-4">
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
        <NovaUrlDestino handleGetFinalURL={handleGetFinalURL} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Nome</TableHead>
            <TableHead>URL Destino</TableHead>
            <TableHead>Cliente Relacionado</TableHead>
            <TableHead>Campanha Relacionada</TableHead>
            <TableHead>Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finalURL.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.url}</TableCell>
              <TableCell>{i.clientName}</TableCell>
              <TableCell>{i.campaignName}</TableCell>
              <TableCell>{i.totalClicks}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <EditarUrlDestino
                  id={i.id}
                  name={i.name}
                  campaign={i.campaignName}
                  client={i.clientName}
                  url={i.url}
                  handleGetFinalURL={handleGetFinalURL}
                />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteFinalUrl(i.id)}
                >
                  <UserRoundX size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
