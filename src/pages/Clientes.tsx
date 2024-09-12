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
import { useContextState } from "@/hook/state";
import { customerData, DataProps } from "@/interface/auth";
import { api, aws } from "@/services/Api";
import { AxiosError } from "axios";
import { CircleArrowLeft, UserRoundX } from "lucide-react";
import { useEffect, useState } from "react";

type dataCustomerProps = { data: DataProps };

export function ClientesPage() {
  const { setIsFocus } = useContextState();
  const { data } = useAuth() as dataCustomerProps;
  const { deleteCustomer } = useAuth();
  const [customerData, setCustomerData] = useState<customerData[]>([]);

  const handleGetClient = async () => {
    try {
      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomerData(response.data);
      console.log(response.data);
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

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="bg-[#8b8b8b63] rounded-full w-3 h-3"></span>
          <h1 className="text-3xl">Clientes</h1>
        </div>
        <Button
          onClick={() => setIsFocus("user")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovoCliente onCreateClient={handleGetClient} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="w-[80px] text-center">Logo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Campanhas</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>Links</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerData.map((i, index) => (
            <TableRow key={index}>
              <TableCell>
                <img src={`${aws}${i.logo}`} alt={"Logo" + i.logo} />
              </TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i._count.campaigns}</TableCell>
              <TableCell>{i.totalActions}</TableCell>
              <TableCell>{i.totalClicks}</TableCell>
              <TableCell>{i.totalLinks}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
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
