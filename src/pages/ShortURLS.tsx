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
import { NovaUrl } from "@/components/Modal/NovaUrl";
import { EditarUrl } from "@/components/Modal/EditarUrl";
import { useAuth } from "@/hook/Auth";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { DataProps, urlData } from "@/interface/auth";

type dataUrlProps = { data: DataProps };

export function ShortUrlsPage() {
  const { setIsFocus } = useContextState();
  const [url, setUrl] = useState<urlData[]>([]);
  const { data } = useAuth() as dataUrlProps;
  const { deleteURL } = useAuth();

  const handleGetUrl = async () => {
    try {
      const response = await api.get("/base-url", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setUrl(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as URLs, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    handleGetUrl();
  }, [data.jwtToken]);

  /* deletar url */
  const handleDeleteUrl = async (id: number) => {
    await deleteURL({ id });
    handleGetUrl();
  };

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
        <NovaUrl onCreateUrl={handleGetUrl} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead>URL</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {url.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.url}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <EditarUrl id={i.id} url={i.url} onEditUrl={handleGetUrl} />
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteUrl(i.id)}
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
