import { EditarUsuario } from "@/components/Modal/EditarUsuario";
import { NovoUsuario } from "@/components/Modal/NovoUsuario";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft, UserRoundX } from "lucide-react";
import { useState } from "react";

type UserDataProps = { id: number; logo: string; cliente: string };

export function ClientesPage() {
  const {setIsFocus} = useContextState();
  const [userData, setUserData] = useState<UserDataProps[]>([
    {
      id: 0,
      logo: ".jpg",
      cliente: "Nike",
    },
  ]);

  function removeUser(id: number) {
    setUserData((state) => state.filter((i) => i.id !== id));
  }

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
        <NovoUsuario/>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Logo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((i) => (
            <TableRow key={i.id}>
              <TableCell>
                <img src={i.logo}
                alt={'Logo'+i.logo}/>
              </TableCell>
              <TableCell>
                {i.cliente}
              </TableCell>
              <TableCell
              className="flex items-center justify-end gap-2">
                <EditarUsuario/>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => removeUser(i.id)}>
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