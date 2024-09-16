import { AlertMessage } from "@/components/alert_message";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/Auth";
import {
  ApiResponse,
  campaignData,
  conversorData,
  createNewSingleLink,
  customerData,
  dataAction,
  DataProps,
  urlData,
} from "@/interface/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/services/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { AxiosError } from "axios";
import { Link2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SelectLP } from "@/components/SelectLP";

const verifyCreateLink = z.object({
  customer: z.string().min(1, ""),
  campaignId: z.number().min(1, ""),
  actionId: z.number().min(1, ""),
  baseUrlId: z.number().min(1, ""),
  alphabetId: z.number().min(1, ""),
  redirectUrl: z.string().min(4, "*Digite uma url válida"),
  length: z.number(),
  qrCode: z.boolean(),
  replace: z.string(),
  conversionPosition: z.string(),
});

type encurtadorDados = z.infer<typeof verifyCreateLink>;

type HandleCreateLinkProps = {
  handleCreateSingleLink: ({
    actionId,
    baseUrlId,
    alphabetId,
    redirectUrl,
    length,
    qrCode,
  }: createNewSingleLink) => Promise<ApiResponse>;
  data: DataProps;
};

export function EncurtadorDois() {
  const { data, handleCreateSingleLink } = useAuth() as HandleCreateLinkProps;
  const [clients, setClients] = useState<customerData[]>([]);
  // const [progress, setProgress] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [acoes, setAcoes] = useState<dataAction[]>([]);
  const [baseUrl, setBaseUrl] = useState<urlData[]>([]);
  const [conversor, setConversor] = useState<conversorData[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>(6);
  const linkLength = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
  ];
  const [returnData, setReturnData] = useState<ApiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedCampaign, setIsSelectedCampaign] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [selectedPositionValue, setselectedPositionValue] = useState("pre");

  //FUNÇÃO SALVANDO NO ESTADO O VALOR DE COMPRIMENTO
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue("length", newValue);
    setSelectedValue(newValue);
  };

  //SALVANDO O CLIENTE SELECIONADO
  const clienteSelecionado =
    clients
      .filter((customer) => selectedClient === customer.name)
      .map((customer) => customer.id)
      .join(", ") || "Cliente não encontrado";

  //VALIDANDO O NOME DA CAMPANHA/AÇÃO/CONVERSOR E BUSCANDO O ID BASEADO NO CLIENTE
  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
      console.log(`id da campanha: ${selectedCampaign.id}`);
      setIsSelectedCampaign(!!value);
    }
  };

  const handleSelectAction = (value: string) => {
    const selectedAction = acoes.find((acao) => acao.name === value);
    if (selectedAction) {
      setValue("actionId", selectedAction.id);
      console.log(`id da ação: ${selectedAction.id}`);
    }
  };

  const handleSelectBaseUrl = (value: string) => {
    const selectedBaseUrl = baseUrl.find((url) => url.url === value);
    if (selectedBaseUrl) {
      setValue("baseUrlId", selectedBaseUrl.id);
      setUrl(selectedBaseUrl.url);
      console.log(`id da baseUrl: ${selectedBaseUrl.id}`);
    }
  };

  const handleSelectConversor = (value: string) => {
    const selectedConversor = conversor.find(
      (conversor) => conversor.name === value
    );
    if (selectedConversor) {
      setValue("alphabetId", selectedConversor.id);
      console.log(`id do conversor: ${selectedConversor.id}`);
    }
  };

  const handleSelectedPositionValue = (value: string) => {
    setselectedPositionValue(value);
  };

  //FUNÇÃO SALVANDO NO ESTADO A QUANTIDADE DE CARACTERES DO LINK
  const generateLink = () => {
    return linkLength.slice(0, selectedValue).join("");
  };

  //FUNÇÃO SALVANDO NO ESTADO O CLIENTE SELECIONADO
  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
  };

  //GET CLIENTES
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/clients`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setClients(response.data);
        console.log(response.data);
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
  }, [data.jwtToken]);

  //GET BASEURL
  useEffect(() => {
    async function handleGetBaseUrl() {
      try {
        const response = await api.get("/base-url", {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setBaseUrl(response.data);
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
    }
    handleGetBaseUrl();
  }, [data.jwtToken]);

  //GET CONVERSOR
  useEffect(() => {
    async function handleGetConversor() {
      try {
        const response = await api.get("/alphabets", {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setConversor(response.data);
        console.log(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar os conversores, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetConversor();
  }, [data.jwtToken]);

  //GET BUSCANDO AS CAMPANHAS DO CLIENTE SELECIONADO
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(
          `/campaigns?clientId=${clienteSelecionado}`,
          {
            headers: {
              Authorization: `Bearer ${data.jwtToken}`,
            },
          }
        );
        setCampanhas(response.data);
        console.log(response.data);
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
  }, [clienteSelecionado]);

  //GET BUSCANDO AS AÇÕES DO CLIENTE SELECIONADO
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(
          `/actions?clientId=${clienteSelecionado}`,
          {
            headers: {
              Authorization: `Bearer ${data.jwtToken}`,
            },
          }
        );
        setAcoes(response.data);
        console.log(response.data);
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
  }, [clienteSelecionado]);

  //VALIDAÇÃO
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<encurtadorDados>({
    resolver: zodResolver(verifyCreateLink),
    defaultValues: {
      actionId: 0,
      baseUrlId: 0,
      alphabetId: 0,
      redirectUrl: "",
      length: 6,
      qrCode: false,
    },
  });

  //Assistindo o valor do input de personalizar url
  const valorAssistido = watch("replace");

  async function createLink(data: createNewSingleLink) {
    const { actionId, baseUrlId, alphabetId, redirectUrl, length, qrCode } =
      data;

    try {
      const response: ApiResponse = await handleCreateSingleLink({
        actionId,
        baseUrlId,
        alphabetId,
        redirectUrl,
        length,
        qrCode,
      });

      setReturnData(response);
      setIsModalOpen(true);
      reset();
    } catch (error) {
      console.error("Erro ao criar link:", error);
    }
  }

  const handleCloseModal = () => {
    setReturnData(null);
    setIsModalOpen(false);
  };

  const handleDownloadQRCode = async () => {
    if (returnData) {
      const imageUrl = `bigdates/${returnData.qrCode}`;

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode-${returnData.shortUrl}.png`; // Nome do arquivo a ser salvo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Limpa o URL após o download
      } catch (error) {
        console.error("Erro ao baixar a imagem:", error);
      }
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copiado para a área de transferência!");
    });
  };

  return (
    <>
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-[601px] m-auto">
        <h1 className="text-3xl font-semibold w-max m-auto pb-8">
          Lorem ipsum dolor
        </h1>
        <form onSubmit={handleSubmit(createLink)}>
          <div className="grid grid-cols-4 gap-4 max-w-[500px]">
            <div className="col-span-2">
              {/* SELECT CUSTOMER */}
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.customer}`}>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {clients.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customer && (
                <span className="text-xs text-rose-400 font-normal">
                  *Selecione um cliente
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-2">
              {/* SELECT CAMPAIGN */}
              <Controller
                name="customer"
                control={control}
                render={() => (
                  <Select
                    disabled={!selectedClient}
                    onValueChange={handleSelectCampaign}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedClient
                            ? "Cliente não selecionado"
                            : "Selecione a campanha"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Campanhas</SelectLabel>
                        {campanhas.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.campaignId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/*FINAL CAMPAIGN*/}
            </div>
            <div className="col-span-2">
              <SelectLP />
            </div>
            <div className="col-span-2">
              {/* SELECT ACTION */}
              <Controller
                name="actionId"
                control={control}
                render={() => (
                  <Select
                    disabled={!isSelectedCampaign}
                    onValueChange={handleSelectAction}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !isSelectedCampaign
                            ? "Campanha não selecionada"
                            : "Selecione a ação"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ações</SelectLabel>
                        {acoes.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.actionId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT ACTION */}
            </div>
            <div className="col-span-4">
              {/* SELECT SHORTENER */}
              <Controller
                name="baseUrlId"
                control={control}
                render={() => (
                  <Select onValueChange={handleSelectBaseUrl}>
                    <SelectTrigger>
                      <SelectValue placeholder="ShortURL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Encurtadores</SelectLabel>
                        {baseUrl.map((i, index) => (
                          <SelectItem value={i.url} key={index}>
                            {i.url}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.baseUrlId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT SHORTENER */}
            </div>
            <div className="col-span-3">
              <Label className="font-semibold">Conversor</Label>
              {/* SELECT CONVERSOR */}
              <Controller
                name="alphabetId"
                control={control}
                render={() => (
                  <Select onValueChange={handleSelectConversor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o conversor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Conversores</SelectLabel>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        {conversor.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.alphabetId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Selecione um conversor
                </span>
              )}
              {/* FINAL SELECT CONVERSOR */}
            </div>
            <div className="flex flex-col col-span-1">
              <Label htmlFor="comprimento" className="font-semibold">
                Comprimento
              </Label>
              <Input
                id="comprimento"
                type="number"
                value={selectedValue}
                onChange={handleValueChange}
                min={6}
                max={20}
                className="col-span-1"
              />
            </div>
            <div className="flex flex-col gap-1 col-span-4">
              <label htmlFor="urlFinal" className="font-semibold">
                Preencha a URL final
              </label>
              <input
                id="urlFinal"
                type="text"
                placeholder="https://"
                {...register("redirectUrl")}
                className={`pl-4 bg-transparent rounded-md border border-input min-h-[36px] ${
                  errors.redirectUrl && "border-rose-400"
                }`}
              />
              {errors.redirectUrl && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.redirectUrl.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="personalizarUrl" className="font-semibold">
                Personalizar URL
              </label>
              <input
                id="personalizarUrl"
                type="text"
                placeholder="/url-personalizada"
                {...register("replace")}
                className={`pl-4 bg-transparent rounded-md border border-input min-h-[36px] ${
                  errors.replace && "border-rose-400"
                }`}
              />
              {errors.replace && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.replace.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <Label className="font-semibold">Pré/Pós Conversão</Label>
              <Controller
                name="conversionPosition"
                control={control}
                defaultValue=""
                render={() => (
                  <Select
                    value={selectedPositionValue}
                    onValueChange={handleSelectedPositionValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Posição da URL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Selecione a posição</SelectLabel>
                        <SelectItem value="pre">Pré Conversão</SelectItem>
                        <SelectItem value="pos">Pós Conversão</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col items-center gap-1 col-span-4">
              <Label className="font-bold">Link Final</Label>
              <Input
                type="text"
                value={
                  !url && valorAssistido === ""
                    ? `https://exemplo.com/${generateLink()}`
                    : !url &&
                      valorAssistido !== "" &&
                      selectedPositionValue === "pre"
                    ? `https://exemplo.com/${valorAssistido}/${generateLink()}`
                    : !url &&
                      valorAssistido !== "" &&
                      selectedPositionValue === "pos"
                    ? `https://exemplo.com/${generateLink()}/${valorAssistido}`
                    : url && valorAssistido === ""
                    ? `https://${url}/${generateLink()}`
                    : url &&
                      valorAssistido !== "" &&
                      selectedPositionValue === "pre"
                    ? `https://${url}/${valorAssistido}/${generateLink()}`
                    : url &&
                      valorAssistido !== "" &&
                      selectedPositionValue === "pos"
                    ? `https://${url}/${generateLink()}/${valorAssistido}`
                    : ""
                }
                disabled
              />
            </div>
            <Controller
              name="qrCode"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-4 col-span-4">
                  <Input
                    id="qrCode"
                    type="checkbox"
                    className="max-w-[16px]"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <Label
                    htmlFor="qrCode"
                    className="text-nowrap cursor-pointer"
                  >
                    Gerar QRCode
                  </Label>
                </div>
              )}
            />
          </div>
          <div className="pb-12 text-right mt-8 max-w-[500px]">
            <Button className="w-full" variant="secondary">
              <div className="flex items-center gap-2">
                <Send size={18} />
                Enviar
              </div>
            </Button>
          </div>
        </form>
      </div>

      {returnData && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-center">Dados da URL</DialogTitle>
              <DialogDescription className="text-center">
                Após o fechamento do modal, esses dados serão perdidos.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="flex">
                <Button
                  variant={"outline"}
                  className="p-2 min-w-[320px]"
                  onClick={() => handleCopyToClipboard(returnData.shortUrl)}
                >
                  <span>baseUrlEscolhida/{returnData.shortUrl}</span>
                  <Link2 size={18} className="ml-4" />
                </Button>
              </div>
              <div>
                <img
                  src={
                    returnData
                      ? `https://cdn-encurtador.bigdates.com.br/${returnData.qrCode}`
                      : "ntemqrcode"
                  }
                  alt="qrCode"
                  className="max-w-[320px]"
                />
                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={handleDownloadQRCode}
                >
                  Baixar QRCode
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
