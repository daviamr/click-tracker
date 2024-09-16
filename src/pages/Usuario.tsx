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
import { Button } from "@/components/ui/button";
import { UserRoundX, UsersRound } from "lucide-react";
import { EditarUsuario } from "@/components/Modal/EditarUsuario";
import { Skeleton } from "@/components/ui/skeleton";

type dataUserProps = { data: DataProps };

export function UsuarioPage() {
  const { data } = useAuth() as dataUserProps;

  const [userData, setUserData] = useState<userDataProps[]>([]);

  const handleGetUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setUserData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os usuários, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, [data.jwtToken]);

  return (
    <>
      <div className="flex gap-4 justify-between mb-8">
        <div className="flex items-center gap-2 relative">
          <UsersRound size={24} />
          <h1 className="text-3xl">Usuários</h1>
        </div>
        <NovoUsuario onCreateUser={handleGetUsers} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((i, index) => {
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
                <TableCell>
                  {i.name ? i.name : <Skeleton className="h-4 w-full" />}
                </TableCell>
                <TableCell>
                  {i.email ? i.email : <Skeleton className="h-4 w-full" />}
                </TableCell>
                <TableCell>{dataFormatada(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  <EditarUsuario
                    onEditUser={handleGetUsers}
                    name={i.name}
                    email={i.email}
                  />
                  <Button
                    className="p-2 duration-300 hover:text-red-700"
                    variant={"outline"}
                    // onClick={() => handleDeleteCustomer(i.id)}
                  >
                    <UserRoundX size={18} />
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
