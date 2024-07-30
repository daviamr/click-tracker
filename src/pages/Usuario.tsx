import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NovoUsuario } from "@/components/Modal/NovoUsuario";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { DataProps, userDataProps } from "@/interface/auth";

export function UsuarioPage() {
  let DataAtual = new Date();
  let DataFormatada = DataAtual.toLocaleString();

  const { data } = useAuth() as DataProps;

  const [userData, setUserData] = useState<userDataProps[]>([]);

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/users',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setUserData(response.data)
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

console.log(userData)

return (
    <>
    <div className="flex gap-4 justify-end">
        <NovoUsuario />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((i, index) => (
            <TableRow key={index}>
              <TableCell className="max-w-[100px]">{i.id}</TableCell>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.email}</TableCell>
              <TableCell>{i.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
