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
import { NovaUrl } from "@/components/Modal/NovaUrl";
import { EditarUrl } from "@/components/Modal/EditarUrl";

export function ShortUrlsPage() {
  const { setIsFocus } = useContextState();
  const [urls, setUrls] = useState([
    {
      id: 0,
      url: 'https://exemple.com/'
    },
  ]); // Estado para a lista de campanhas

  const removeUrl = (id: number) => {
    setUrls((state) => state.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Short URL's</h1>
        <Button
          onClick={() => setIsFocus("campaign")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex gap-4 justify-end">
        <NovaUrl />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.url}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarUrl />
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
