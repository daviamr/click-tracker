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
import { useState } from "react";
import { NovoConversor } from "@/components/Modal/NovoConversor";
import { EditarConversor } from "@/components/Modal/EditarConversor";

export function ConversorPage() {
  const { setIsFocus } = useContextState();
  const [conversor, setConversor] = useState([
    {
      id: 0,
      url: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore fugiat iure possimus aliquam quae ea officia doloribus, ipsa sunt blanditiis fugit. Doloribus, sit. Optio voluptas suscipit fugiat ad corporis incidunt?'
    },
  ]); // Estado para a lista de campanhas

  const removeUrl = (id: number) => {
    setConversor((state) => state.filter((i) => i.id !== id));
  }

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
          <TableRow>
            <TableHead>Conversor</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversor.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.url}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarConversor/>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => removeUrl(i.id)}
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
