import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Braces, UserRoundPen, UserRoundX } from "lucide-react";
import { NovaUrlDestino } from "@/components/Modal/NovaUrlDestino";
import { useEffect, useState } from "react";
import { campaignData, DataProps, finalURLProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";

type dataURLProps = { data: DataProps };

export function UrlDestinoPage() {
  const { data } = useAuth() as dataURLProps;
  const [finalURL, setFinalURL] = useState<finalURLProps[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);

  const handleGetFinalURL = async () => {
    try {
      const response = await api.get("/final-urls", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setFinalURL(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os usuários, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  const handleGetCampaign = async () => {
    try {
      const response = await api.get("/campaigns", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCampanhas(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as campanhas, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetFinalURL();
    handleGetCampaign();
  }, [data.jwtToken]);
  console.log(finalURL)

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Braces size={30} className="animate-pulse" />
          URLs de Destino
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovaUrlDestino handleGetFinalURL={handleGetFinalURL}/>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Nome</TableHead>
            <TableHead>URL Destino</TableHead>
            <TableHead>Cliente Relacionado</TableHead>
            <TableHead>Campanha Relacionada</TableHead>
            <TableHead>Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finalURL.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.name}</TableCell>
              <TableCell>{i.url}</TableCell>
              <TableCell>{i.campaign.client.name}</TableCell>
              <TableCell>{campanhas.find((c) => i.campaignId === c.id)?.name || "0"}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </>
  );
}
