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
import { UserRoundX, Users } from "lucide-react";
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
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Users size={30} className="animate-pulse"/>
          Usuários
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovoUsuario onCreateUser={handleGetUsers} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="pl-4">Nome</TableHead>
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
                <TableCell className="pl-4">
                  {i.name ? i.name : <Skeleton className="h-4 w-full" />}
                </TableCell>
                <TableCell>
                  {i.email ? i.email : <Skeleton className="h-4 w-full" />}
                </TableCell>
                <TableCell>{dataFormatada(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-end gap-2 pr-4">
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
