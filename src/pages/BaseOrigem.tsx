import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, UserRoundPen, UserRoundX } from "lucide-react";
import { NovaBase } from "@/components/Modal/NovaBase";

export function OriginBasePage() {
  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Database size={30} className="animate-pulse" />
          Base Origem
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovaBase />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Nome</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="flex items-center justify-end gap-2 pr-4">
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
