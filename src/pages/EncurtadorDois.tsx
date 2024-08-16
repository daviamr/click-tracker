import { AlertMessage } from "@/components/alert_message";
import { BarraProgresso } from "@/components/BarraProgresso";
import { SelectAcao } from "@/components/SelectAcao";
import { SelectCampanha } from "@/components/SelectCampaign";
import { SelectCliente } from "@/components/SelectClient";
import { SelectConversor } from "@/components/SelectConversor";
import { SelectEncurtador } from "@/components/SelectShort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/Auth";
import { DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { Label } from "@radix-ui/react-label";
import { AxiosError } from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

type shortenerData = {
  data: DataProps;
};

export function EncurtadorDois() {
  const { data } = useAuth() as shortenerData;
  const [actions, setActions] = useState([]);
  const [clients, setClients] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [qrCodeActive, setQrCodeActive] = useState<boolean>(false);

  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
    console.log(selectedClient);
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
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-[480px] m-auto">
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
            <div className="flex items-center gap-4">
              <Input
              id="qrCode"
              type="checkbox"
              className="max-w-[16px]"
              checked={qrCodeActive}
              onChange={(e) => setQrCodeActive(e.target.checked)}/>
              <Label htmlFor="qrCode" className="text-nowrap cursor-pointer">Gerar QRCode</Label>
            </div>
          </div>
          <div className="pb-12 text-right mt-8 max-w-[500px]">
            <Button
              className="w-full"
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
