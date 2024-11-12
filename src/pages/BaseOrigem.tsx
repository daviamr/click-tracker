import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, UserRoundX } from "lucide-react";
import { NovaBase } from "@/components/Modal/NovaBase";
import { api } from "@/services/Api";
import { baseProps, DataProps } from "@/interface/auth";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { useAuth } from "@/hook/Auth";
import { EditarBase } from "@/components/Modal/EditarBase";

type dataBaseProps = { data: DataProps };

export function BaseOrigemPage() {
  const { data } = useAuth() as dataBaseProps;
  const { deleteBase } = useAuth();
  const [base, setBase] = useState<baseProps[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);

  const handleGetBase = async () => {
    try {
      const response = await api.get("/data-sources", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setBase(response.data);
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
    handleGetBase();
  }, [data.jwtToken]);

  /* deletar campanha */
  const handleDeleteBase = async (id: number) => {
    await deleteBase({ id });
    handleGetBase();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetBase();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Database size={30} className="animate-pulse" />
          Origem Base
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
        <NovaBase handleGetBase={handleGetBase} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Nome</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Campanhas</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {base.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.url}</TableCell>
              <TableCell>{i.campaigns}</TableCell>
              <TableCell>{i.actions}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <EditarBase
                  id={i.id}
                  name={i.name}
                  url={i.url}
                  handleGetBase={handleGetBase}
                />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteBase(i.id)}
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
