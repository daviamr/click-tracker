import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, History, UserRoundPen, UserRoundX } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { dataAction, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";

type dataHistoryProps = { data: DataProps };

export function HistoricoPage() {
  const { data } = useAuth() as dataHistoryProps;
  const [dataAction, setAction] = useState<dataAction[]>([]);

  const handleGetAction = async () => {
    try {
      const response = await api.get("/actions", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setAction(response.data);
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

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <History size={30} className="animate-pulse" />
          Histórico
        </h1>
      </div>
      <div className="flex justify-end border-solid border-b-[1px] py-2 px-4"></div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Ação</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Unique Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataAction.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="pl-4">{i.name}</TableCell>
              <TableCell>{i.campaignName}</TableCell>
              <TableCell>{i.clientName}</TableCell>
              <TableCell>{i.totalLinks}</TableCell>
              <TableCell>{i.totalClicks}</TableCell>
              <TableCell></TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <Button variant={"outline"} className="flex gap-2 items-center">
                  <FileDown size={16} />
                  Exportar
                </Button>
                <Button className="p-2" variant={"outline"}>
                  <UserRoundPen size={18} />
                </Button>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  // onClick={() => handleDeleteCustomer(i.id)}
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
