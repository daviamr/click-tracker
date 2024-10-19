import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { campaignData, DataProps, lpsData } from "@/interface/auth";
import { Button } from "@/components/ui/button";
import { Laptop, UserRoundPen, UserRoundX } from "lucide-react";
import { NovaLP } from "@/components/Modal/NovaLP";

type dataUserProps = { data: DataProps };

export function LPsPage() {
  const { data } = useAuth() as dataUserProps;
  const { deleteLp } = useAuth();
  const [lps, setLPs] = useState<lpsData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);

  const handleGetLP = async () => {
    try {
      const response = await api.get("/lps", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setLPs(response.data);
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
    handleGetLP();
    handleGetCampaign();
  }, [data.jwtToken]);

  /* deletar cliente */
  const handleDeleteLp = async (id: number) => {
    await deleteLp({ id });
    handleGetLP();
  };

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Laptop size={30} className="animate-pulse" />
          LPs, Sites e Portais
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovaLP onCreateLP={handleGetLP} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* <TableHead>
                <Checkbox className="pointer-events-auto"/>
            </TableHead> */}
            <TableHead className="pl-4">LP</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lps.map((i) => (
            <TableRow key={i.id}>
              {/* <TableCell>
                    <Checkbox/>
                </TableCell> */}
              <TableCell>{i.name}</TableCell>
              <TableCell></TableCell>
              <TableCell>
              {campanhas.find((c) => i.campaingId === c.id)?.name || "0"}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{i.url}</TableCell>
              <TableCell></TableCell>
              <TableCell className="flex items-center justify-end gap-2 pr-4">
                <Button className="p-2" variant={"outline"}>
                  <UserRoundPen size={18} />
                </Button>
                <Button
                  className="p-2 duration-300 hover:text-red-700"
                  variant={"outline"}
                  onClick={() => handleDeleteLp(i.id)}
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
