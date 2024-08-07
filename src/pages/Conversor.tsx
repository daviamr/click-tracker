import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft, CircleX } from "lucide-react";
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

type dataConversorProps = {data: DataProps}

export function ConversorPage() {
  const { setIsFocus } = useContextState();
  const [conversor, setConversor] = useState<conversorData[]>([]);
  const { data } = useAuth() as dataConversorProps
  const {deleteConversor} = useAuth()

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/alphabets',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setConversor(response.data)
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
  }
  handleGetUsers()
},[conversor])

  // const removeUrl = (id: number) => {
  //   setConversor((state) => state.filter((i) => i.id !== id));
  // }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Conversor</h1>
        <Button
          onClick={() => setIsFocus("shorturl")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovoConversor />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="min-w-[100px]">Título</TableHead>
            <TableHead>Conversor</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversor.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.characters}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarConversor id={i.id} name={i.name} characters={i.characters}/>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => deleteConversor({id: i.id})}
                >
                  <CircleX size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
