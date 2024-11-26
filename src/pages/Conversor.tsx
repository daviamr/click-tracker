import { Button } from "@/components/ui/button";
import { CaseLower, FileX2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { NovoConversor } from "@/components/Modal/NovoConversor";
import { EditarConversor } from "@/components/Modal/EditarConversor";
import { useAuth } from "@/hook/Auth";
import { conversorData, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";

type dataConversorProps = { data: DataProps };

export function ConversorPage() {
  const [conversor, setConversor] = useState<conversorData[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);
  const { data } = useAuth() as dataConversorProps;
  const { deleteConversor } = useAuth();

  const handleGetConversor = async () => {
    try {
      const response = await api.get("/alphabets", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setConversor(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os conversores, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetConversor();
  }, [data.jwtToken]);

  /* deletar conversor */
  const handleDeleteConversor = async (id: number) => {
    await deleteConversor({ id });
    handleGetConversor();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetConversor();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <CaseLower size={30} className="animate-pulse" />
          Conversores
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
        <NovoConversor onCreateConversor={handleGetConversor} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="min-w-[100px] pl-4">Título</TableHead>
            <TableHead>Conversor</TableHead>
            <TableHead>Caracteres</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversor.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="pl-4">{i.name}</TableCell>
              <TableCell>{i.characters}</TableCell>
              <TableCell>{i.characters.length}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <EditarConversor
                  id={i.id}
                  name={i.name}
                  characters={i.characters}
                  onEditConversor={handleGetConversor}
                />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteConversor(i.id)}
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
