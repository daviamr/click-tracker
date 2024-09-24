import { Button } from "@/components/ui/button";
import { CircleX, Link2 } from "lucide-react";
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
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Link2 size={30} className="animate-pulse"/>
          ShortURLs
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovaUrl onCreateUrl={handleGetUrl} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead className="pl-4">URL</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {url.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="pl-4">{i.url}</TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
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
