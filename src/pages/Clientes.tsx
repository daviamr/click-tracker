import { AlertMessage } from "@/components/alert_message";
import { EditarCliente } from "@/components/Modal/EditarCliente";
import { NovoCliente } from "@/components/Modal/NovoCliente";
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
import { customerData, DataProps } from "@/interface/auth";
import { api, aws } from "@/services/Api";
import { AxiosError } from "axios";
import { Building2, RefreshCw, UserRoundX } from "lucide-react";
import { useEffect, useState } from "react";

type dataCustomerProps = { data: DataProps };

export function ClientesPage() {
  const { data } = useAuth() as dataCustomerProps;
  const { deleteCustomer } = useAuth();
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);

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

  /* deletar cliente */
  const handleDeleteCustomer = async (id: string) => {
    await deleteCustomer({ id });
    handleGetClient();
  };

  const refresh = () => {
    setRefreshStatus(true);
    handleGetClient();
    setTimeout(() => {
      setRefreshStatus(false);
      AlertMessage("Planilha atualizada com sucesso.", "success");
    }, 1000);
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Building2 size={30} className="animate-pulse" />
          Clientes
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
        <NovoCliente onCreateClient={handleGetClient} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="w-[80px] text-center">Logo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Campanhas</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>LPs</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerData.map((i, index) => (
            <TableRow key={index}>
              <TableCell className="pl-4">
                <img src={`${aws}${i.logo}`} alt={"Logo" + i.logo} />
              </TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.totalCampaigns}</TableCell>
              <TableCell>{i.totalActions}</TableCell>
              <TableCell>{i.totalClicks}</TableCell>
              <TableCell>{i.totalLinks}</TableCell>
              <TableCell>{i.totalLps}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <EditarCliente
                  onEditClient={handleGetClient}
                  id={i.id}
                  name={i.name}
                />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteCustomer(i.id)}
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
