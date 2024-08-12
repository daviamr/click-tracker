import { AlertMessage } from "@/components/alert_message";
import { BarraProgresso } from "@/components/BarraProgresso";
import { SelectAcao } from "@/components/SelectAcao";
import { SelectCampanha } from "@/components/SelectCampaign";
import { SelectCliente } from "@/components/SelectClient";
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
};

export function EncutadorPage() {
  const { data } = useAuth() as shortenerData;
  const [actions, setActions] = useState([]);
  const [clients, setClients] = useState([]);
  const { setIsFocus } = useContextState();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");

  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setProgress(20);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      const response = await api.post(`/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwtToken}`,
        },
        // Passe os dados do formulário aqui
        body: JSON.stringify({
          dados: "seus dados aqui",
        }),
      });

      clearInterval(interval);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        setProgress(100);
        console.log("Dados recebidos:", data);
      } else {
        console.error("Erro na requisição");
        setProgress(0);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("/actions/1/download?name=oi", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "nome_do_arquivo.xlsx"); // Nome do arquivo para download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download da planilha:", error);
    }
  };

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
        const response = await api.get(`/clients`, {
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
        <Button
        variant={"secondary"}
        className="flex gap-2 items-center"
        onClick={handleDownload}>
          <Download size={18} />
          Baixar arquivo exemplo
        </Button>
      </div>
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-max m-auto">
        <h1 className="text-3xl font-semibold w-max m-auto pb-8">
          Lorem ipsum dolor
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-4 max-w-[500px]">
            <div className="col-span-2">
              <SelectCliente onChange={handleSelectChange} />
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
            <Button
              className="col-span-1"
              variant="secondary"
              disabled={loading}
            >
              <div className="flex items-center gap-2">
                <Send size={18} />
                Enviar
              </div>
            </Button>
          </div>

          {/* ProgressBar */}
          {loading && <BarraProgresso value={progress} />}
        </form>
      </div>
    </>
  );
}
