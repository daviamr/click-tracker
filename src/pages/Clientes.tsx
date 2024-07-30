import { AlertMessage } from "@/components/alert_message";
import { EditarUsuario } from "@/components/Modal/EditarUsuario";
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
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { CircleArrowLeft, UserRoundX } from "lucide-react";
import { useEffect, useState } from "react";

export function ClientesPage() {
  const {setIsFocus} = useContextState();
  const {data} = useAuth() as DataProps
  const [customerData, setCustomerData] = useState<customerData[]>([]);

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/clients',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setCustomerData(response.data)
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível deletar uma conta agora, tente novamente mais tarde!",
          "error"
        );
      }
    }
  }
  handleGetUsers()
},[])

  // function removeUser(id: number) {
  //   setCustomerData((state) => state.filter((i) => i.id !== id));
  // }

  console.log(customerData)
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Clientes</h1>
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
        <NovoCliente/>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="w-[120px]">Logo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerData.map((i, index) => (
            <TableRow key={index}>
              <TableCell>
                <img src={`${api.defaults.baseURL}/${i.logo}`}
                alt={'Logo'+i.logo}/>
              </TableCell>
              <TableCell>
                {i.name}
              </TableCell>
              <TableCell
              className="flex items-center justify-end gap-2">
                <EditarUsuario/>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}>
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