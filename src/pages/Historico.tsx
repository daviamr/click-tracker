import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, History, UserRoundPen, UserRoundX } from "lucide-react";

export function HistoryPage() {
  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <History size={30} className="animate-pulse" />
          Histórico
        </h1>
      </div>
      <div className="flex justify-end border-solid border-b-[1px] py-2 px-4">
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Ação</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Links</TableHead>
            <TableHead>Cliques</TableHead>
            <TableHead>Cliques Únicos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="pl-4">acao1</TableCell>
            <TableCell>campanha1</TableCell>
            <TableCell>cliente1</TableCell>
            <TableCell>77</TableCell>
            <TableCell>88</TableCell>
            <TableCell>99</TableCell>
            <TableCell className="flex items-center justify-end gap-2 pr-4">
              <Button variant={"outline"} className="flex gap-2 items-center">
                <FileDown size={16} />
                Exportar
              </Button>
              <Button className="p-2" variant={"outline"}>
                <UserRoundPen size={18} />
              </Button>
              <Button
                className="p-2 duration-300 hover:text-red-700"
                variant={"outline"}
                // onClick={() => handleDeleteCustomer(i.id)}
              >
                <UserRoundX size={18} />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
