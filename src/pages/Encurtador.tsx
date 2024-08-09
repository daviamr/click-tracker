import { AlertMessage } from "@/components/alert_message";
import { SelectAcao } from "@/components/SelectAcao";
import { SelectCampanha } from "@/components/SelectCampaign";
// import { SelectCliente } from "@/components/SelectClient";
import { SelectConversor } from "@/components/SelectConversor";
import { SelectEncurtador } from "@/components/SelectShort";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/Auth";
import { useContextState } from "@/hook/state";
import { DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { CircleArrowLeft, Download, Send } from "lucide-react";
import { useEffect, useState } from "react";
// import { z } from "zod";

// const verifyCreateAction = z.object({
//   actionId: z.number(),
//   baseUrlId: z.number(),
//   alphabetId: z.number(),
//   length: z.number(),
//   sheet: z
//     .any()
//     .refine((files) => files instanceof FileList && files.length > 0, { message: "*Campo obrigatório" }),
//   longUrl: z.string().min(4, '*Digite uma url válida'),
//   replace: z.string()
// });

// type encurtadorDados = z.infer<typeof verifyCreateAction>;

type shortenerData = {
  data: DataProps;
}

export function EncutadorPage() {
  const {data} = useAuth() as shortenerData
  const [actions, setActions] = useState([]);
  const [clients, setClients] = useState([]);
  const { setIsFocus } = useContextState();

  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/actions`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setActions(response.data);
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
    }
    handleGetUsers();
  }, [actions]);

  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/clients/010181a3-a68e-4864-a6da-4b617bb9a35e?includeCampaigns=true`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setClients(response.data);
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
    }
    handleGetUsers();
  }, [clients]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Encurtador</h1>
        <Button
          onClick={() => setIsFocus("campaign")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex justify-end">
        <Button variant={'secondary'}
        className="flex gap-2 items-center">
          <Download size={18}/>
          Baixa arquivo exemplo</Button>
      </div>
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-max m-auto">
        <h1 className="text-3xl font-semibold w-max m-auto pb-8">Lorem ipsum dolor</h1>
        <div className="grid grid-cols-4 gap-4 max-w-[500px]">
        <div className="col-span-2">
            {/* <SelectCliente onChange={() => handleSelectChange(value)}/> */}
          </div>
          <div className="col-span-2">
            <SelectCampanha />
          </div>
          <div className="col-span-2">
            <SelectAcao />
          </div>
          <div className="col-span-2">
            <SelectEncurtador />
          </div>
          <div className="col-span-4">
            <SelectConversor />
          </div>
          <input
            type="file"
            className="cursor-pointer p-1 bg-transparent rounded-md border border-input col-span-4"
          />
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="urlFinal" className="font-semibold">
              Preencha a URL final
            </label>
            <input
              id="urlFinal"
              type="text"
              className="pl-4 bg-transparent rounded-md border border-input min-h-[36px]"
            />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="urlFinal" className="font-semibold">
              Parâmetro a substituir
            </label>
            <input
              id="urlSubstituida"
              type="text"
              placeholder=""
              className="pl-4 bg-transparent rounded-md border border-input min-h-[36px]"
            />
          </div>
        </div>
        <div className="pb-12 text-right mt-8 max-w-[500px]">
          <Button className="col-span-1" variant="secondary">
            <div className="flex items-center gap-2">
              <Send size={18} />
              Enviar
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
