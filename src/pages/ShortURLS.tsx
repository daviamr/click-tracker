import { Button } from "@/components/ui/button";
import { CircleX, Link2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { NovaUrl } from "@/components/Modal/NovaUrl";
import { EditarUrl } from "@/components/Modal/EditarUrl";
import { useAuth } from "@/hook/Auth";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { DataProps, urlData } from "@/interface/auth";

type dataUrlProps = { data: DataProps };

export function ShortUrlsPage() {
  const [url, setUrl] = useState<urlData[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);
  const { data } = useAuth() as dataUrlProps;
  const { deleteURL } = useAuth();

  const handleGetUrl = async () => {
    try {
      const response = await api.get("/base-url", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setUrl(response.data);
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
  };

  useEffect(() => {
    handleGetUrl();
  }, [data.jwtToken]);

  /* deletar url */
  const handleDeleteUrl = async (id: number) => {
    await deleteURL({ id });
    handleGetUrl();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetUrl();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Link2 size={30} className="animate-pulse" />
          SmartURLs
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
        <NovaUrl onCreateUrl={handleGetUrl} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="pl-4">URL</TableHead>
            <TableHead>Campanhas</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {url.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="pl-4">{i.url}</TableCell>
              <TableCell>{i.campaigns}</TableCell>
              <TableCell>{i.actions}</TableCell>
              <TableCell>{i.totalLinks}</TableCell>
              <TableCell>{i.totalClicks}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <EditarUrl id={i.id} url={i.url} onEditUrl={handleGetUrl} />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteUrl(i.id)}
                >
                  <CircleX size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
