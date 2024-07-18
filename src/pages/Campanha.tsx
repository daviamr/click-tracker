import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft, FileX2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { NovaCampanha } from "@/components/Modal/NovaCampanha";
import { EditarCampanha } from "@/components/Modal/EditarCampanha";

export function CampanhaPage() {
  const { setIsFocus } = useContextState();
  const [campanhas, setCampanhas] = useState([
    {
      id: 0,
      campanha: "Campanha1",
      cliente: "Nike",
    },
  ]); // Estado para a lista de campanhas

  const removeCampaign = (id: number) => {
    setCampanhas((state) => state.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Cadastrar campanha</h1>
        <Button
          onClick={() => setIsFocus("customers")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovaCampanha />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Campanha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campanhas.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.campanha}</TableCell>
              <TableCell>{i.cliente}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarCampanha />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => removeCampaign(i.id)}
                >
                  <FileX2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
