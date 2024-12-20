import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";
import {
  ApiResponse,
  campaignData,
  conversorData,
  createTrackerB,
  customerData,
  dataAction,
  DataProps,
  finalURLProps,
  lpsData,
  urlData,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { TooltipTracker } from "@/components/TooltipTracker";
import { Button } from "@/components/ui/button";
import { Link2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const verifyTrackerA = z.object({
  customer: z.string().min(1),
  campaign: z.string().min(1),
  actionId: z.string().min(1),
  baseUrlId: z.string().min(1),
  alphabetId: z.string(),
//   sheet: z
//     .any()
//     .refine((files) => files instanceof FileList && files.length > 0, {
//       message: "*Arquivo não selecionado.",
//     }),
  length: z.string(),
  qrCode: z.boolean(),
  finalUrlId: z.string().min(1),
//   dataSourceId: z.string().min(1),
  tag: z.string(),
  tagPosition: z.string(),
  lpId: z.string().min(1),
});

type trackerBData = z.infer<typeof verifyTrackerA>;
type trackerBProps = {
  data: DataProps;
  handleTrackerB: ({
    actionId,
    baseUrlId,
    alphabetId,
    length,
    qrCode,
    finalUrlId,
    tag,
    tagPosition,
    lpId,
  }: createTrackerB) => Promise<ApiResponse>;
};

export function TrackerB() {
  const { data, handleTrackerB } = useAuth() as trackerBProps;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<trackerBData>({
    resolver: zodResolver(verifyTrackerA),
    defaultValues: {
      actionId: "",
      baseUrlId: "",
      alphabetId: "",
      length: "6",
      qrCode: false,
      finalUrlId: "",
      tag: "",
      tagPosition: "",
    },
  });
  const [customersData, setCustomersData] = useState<customerData[]>([]);
  const [campaignsData, setCampaignsData] = useState<campaignData[]>([]);
  const [lpsData, setLPsData] = useState<lpsData[]>([]);
  const [actionsData, setActionsData] = useState<dataAction[]>([]);
  const [baseUrlsData, setBaseUrls] = useState<urlData[]>([]);
  const [alphabetsData, setAlphabets] = useState<conversorData[]>([]);
  const [finalUrlsData, setFinalUrlsData] = useState<finalURLProps[]>([]);
  const [selectedCustomer, handleSelectedCustomer] = useState<string>("");
  const [selectedCampaign, handleSelectedCampaign] = useState<string>("");
  const [selectedLP, handleSelectedLP] = useState<string>("");
  const [selectedAction, handleSelectedAction] = useState<string>("");
  const [lengthValue, setLengthValue] = useState<number>(6);
  const [selectedTagPosition, setSelectedTagPosition] = useState<string>("before");
  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [returnData, setReturnData] = useState<ApiResponse | null>(null);
  //for the input example url
  const charactersLength = [
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
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const tagValue = watch("tag");
  //

  //support functions
  const handleClientId = (value: string) => {
    const clientId =
      customersData.find((customer) => customer.name === value)?.id ||
      "Id do cliente não encontrado.";
    handleSelectedCustomer(clientId);
    console.log("Id do cliente: " + clientId);
  };
  const handleCampaignId = (value: string) => {
    const campaignId =
      campaignsData.find((campaign) => campaign.name === value)?.id ||
      "Id da campanha não encontrada.";
    handleSelectedCampaign(campaignId.toString());
    console.log("Id da campanha: " + campaignId);
  };
  const handleLPId = (value: string) => {
    const lpId =
      lpsData.find((lp) => lp.name === value)?.id || "Id da LP não encontrada.";
    handleSelectedLP(lpId.toString());
    setValue("lpId", lpId.toString());
    console.log("Id da LP: " + lpId);
  };
  const handleActionId = (value: string) => {
    const actionId =
      actionsData.find((action) => action.name === value)?.id ||
      "Id da ação não encontrada.";
    handleSelectedAction(actionId.toString());
    setValue("actionId", actionId.toString());
    console.log("Id da ação: " + actionId + selectedAction);
  };
  const handleBaseUrlId = (value: string) => {
    const baseUrlId =
      baseUrlsData.find((baseUrl) => baseUrl.url === value)?.id ||
      "Id da baseUrl não encontrada.";
    setValue("baseUrlId", baseUrlId.toString());
    setSelectedUrl(value);
    console.log("Id da baseUrl: " + baseUrlId);
  };
  const handleAlphabetId = (value: string) => {
    const alphabetId =
      alphabetsData.find((alphabet) => alphabet.name === value)?.id ||
      "";
    if (alphabetId) {
      setValue("alphabetId", alphabetId.toString());
      console.log("Id do conversor: " + alphabetId);
    } else {
      setValue("alphabetId", "");
    }
  };
  const handleLenghtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue("length", newValue.toString());
    setLengthValue(newValue);
  };
  const handleSelectedTagPosition = (value: string) => {
    setValue("tagPosition", value);
    setSelectedTagPosition(value);
    console.log("Posição da tag: " + value);
  };
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copiado para a área de transferência!");
    });
  };
  const handleDownloadQRCode = async () => {
    if (returnData) {
      const imageUrl = `${returnData.link.qrCode}`;

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode-${returnData.link.url}.png`; // Nome do arquivo a ser salvo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Limpa o URL após o download
      } catch (error) {
        console.error("Erro ao baixar a imagem:", error);
      }
    }
  };
  const handleCloseResponseModal = () => {
    setReturnData(null);
    setResponseModalIsOpen(false);
  }
  
  //for the input example url
  const generateLink = () => {
    return charactersLength.slice(0, lengthValue).join("");
  };
  //
  const handleFinalUrlId = (value: string) => {
    const finalUrlId =
      finalUrlsData.find((finalurl) => finalurl.name === value)?.id ||
      "Id da url de destino não encontrado.";
    if (finalUrlId) {
      setValue("finalUrlId", finalUrlId.toString());
      console.log("Id da url de destino: " + finalUrlId);
    }
  };

  //requests
  const handleGetUsers = async () => {
    try {
      const response = await api.get(`/clients`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomersData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os clientes, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  const handleGetCampaigns = async () => {
    try {
      const response = await api.get(
        `/campaigns?clientId=${selectedCustomer}`,
        {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        }
      );
      setCampaignsData(response.data);
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
  };
  const handleGetLPs = async () => {
    try {
      const response = await api.get(`/lps?campaignId=${selectedCampaign}`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setLPsData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as lps, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  const handleGetActions = async () => {
    try {
      const response = await api.get(`/actions?lps=${selectedLP}`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setActionsData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as ações, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  const handleGetBaseUrls = async () => {
    try {
      const response = await api.get(`/base-url`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setBaseUrls(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as URL's de base, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  const handleGetAlphabets = async () => {
    try {
      const response = await api.get(`/alphabets`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setAlphabets(response.data);
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
  };
  const handleGetFinalUrls = async () => {
    try {
      const response = await api.get(`/final-urls`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setFinalUrlsData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as URLs de destino, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  //useeffects
  useEffect(() => {
    handleGetUsers();
    handleGetBaseUrls();
    handleGetAlphabets();
    handleGetFinalUrls();
  }, [data.jwtToken]);
  useEffect(() => {
    if (selectedCustomer) {
      handleGetCampaigns();
    }
    if (selectedCampaign) {
      handleGetLPs();
    }
    if (selectedLP) {
      handleGetActions();
    }
  }, [selectedCustomer, selectedCampaign, selectedLP]);

  //create
  async function createTrackerB(data: trackerBData) {
    try {
      const {
        actionId,
        baseUrlId,
        alphabetId,
        length,
        qrCode,
        finalUrlId,
        tag,
        tagPosition,
        lpId,
      } = data;

      const response = await handleTrackerB({
        actionId,
        baseUrlId,
        alphabetId,
        length,
        qrCode: qrCode.toString(),
        finalUrlId,
        tag,
        tagPosition,
        lpId,
      });
      setReturnData(response);
      setResponseModalIsOpen(true);
    } catch (error) {
      console.log("Erro: ", error);
    } finally {
      reset();
    }
  }
  console.log(errors);
  console.log(tagValue)
  return (
    <>
      <div className="relative p-8 bg-transparent rounded-md border border-input w-[601px]">
        <form onSubmit={handleSubmit(createTrackerB)}>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-4 flex justify-center gap-1 border-b-2 mb-2">
              <h1 className="flex items-center gap-2 uppercase font-bold pb-[10px]">
                <span className="flex items-center justify-center w-6 h-6 bg-[#a2d515] rounded-full dark:text-[#000000]">
                  1
                </span>
                Dados da ação
              </h1>
            </div>

            <div className="relative col-span-2 mt-2">
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Cliente
              </p>
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClientId(value);
                      handleSelectedCampaign("");
                      handleSelectedAction("");
                      handleSelectedLP("");
                      handleSelectedAction("");
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.customer && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {customersData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="relative col-span-2 mt-2">
              <p
                className={`absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10 ${
                  !selectedCustomer ? "opacity-80" : ""
                }`}
              >
                Campanha
              </p>
              <div className="relative z-0">
                <Controller
                  name="campaign"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCampaignId(value);
                        handleSelectedLP("");
                      }}
                      disabled={!selectedCustomer}
                    >
                      <SelectTrigger
                        className={`${errors.campaign && "border-rose-400"}`}
                      >
                        <SelectValue
                          placeholder={
                            !selectedCustomer
                              ? "Cliente não selecionado"
                              : "Selecione a campanha"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className={`${errors.customer}`}>
                        <SelectGroup>
                          <SelectLabel>Campanhas</SelectLabel>
                          {campaignsData.map((i, index) => (
                            <SelectItem value={i.name} key={index}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="relative col-span-2 mt-2">
              <p
                className={`absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10 ${
                  !selectedCampaign ? "opacity-80" : ""
                }`}
              >
                LP
              </p>
              <div className="relative z-0">
                <Controller
                  name="lpId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleLPId(value);
                      }}
                      disabled={!selectedCampaign || lpsData.length === 0}
                    >
                      <SelectTrigger
                        className={`${errors.lpId && "border-rose-400"}`}
                      >
                        <SelectValue
                          placeholder={
                            !selectedCampaign
                              ? "Campanha não selecionada"
                              : lpsData.length === 0
                              ? "Nenhuma LP encontrada"
                              : "Selecione a LP"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>LP's</SelectLabel>
                          {lpsData.map((i, index) => (
                            <SelectItem value={i.name} key={index}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="relative col-span-2 mt-2">
              <p
                className={`absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10 ${
                  !selectedLP ? "opacity-80" : ""
                }`}
              >
                Ações
              </p>
              <div className="relative z-0">
                <Controller
                  name="actionId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleActionId(value);
                      }}
                      disabled={!selectedLP || actionsData.length === 0}
                    >
                      <SelectTrigger
                        className={`${errors.actionId && "border-rose-400"}`}
                      >
                        <SelectValue
                          placeholder={
                            !selectedLP
                              ? "LP não selecionada"
                              : actionsData.length === 0
                              ? "Nenhuma ação encontrada"
                              : "Selecione a ação"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Ações</SelectLabel>
                          {actionsData.map((i, index) => (
                            <SelectItem value={i.name} key={index}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="col-span-4 flex justify-center gap-1 border-b-2 mb-2 mt-4">
              <h1 className="flex items-center gap-2 uppercase font-bold pb-[10px]">
                <span className="flex items-center justify-center w-6 h-6 bg-[#a2d515] rounded-full dark:text-[#000000]">
                  2
                </span>
                Encurtador
              </h1>
            </div>

            <div className="relative col-span-2 mt-2">
              {/* <div className="flex">
                <p className="font-semibold">SmartURL</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Você pode escolher qualquer uma das SmartURLs da lista para gerar seus links personalizados. Veja em "URL exemplo" para visualizar o formato que os links serão gerados.'
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                SmartUrl
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='Você pode escolher qualquer uma das SmartURLs da lista para gerar seus links personalizados. Veja em "URL exemplo" para visualizar o formato que os links serão gerados.'
                />
              </p>
              <Controller
                name="baseUrlId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleBaseUrlId(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.baseUrlId && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>SmartURL's</SelectLabel>
                        {baseUrlsData.map((i, index) => (
                          <SelectItem value={i.url} key={index}>
                            {i.url}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div> 

            <div className="relative col-span-1 mt-2">
              {/* <div className="flex">
                <p className="font-semibold">Conversor</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Caso queira gerar uma URL encurtada, é necessário selecionar um conversor. Cada protocolo é compatível com um tipo de conversor diferente. Se não quiser usar um conversor, a plataforma vai simplesmente inserir o dado presente na coluna "A" da planilha enviada para gerar os links de tracking.'
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Conversor
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='Caso queira gerar uma URL encurtada, é necessário selecionar um conversor. Cada protocolo é compatível com um tipo de conversor diferente. Se não quiser usar um conversor, a plataforma vai simplesmente inserir o dado presente na coluna "A" da planilha enviada para gerar os links de tracking.'
                />
              </p>
              <Controller
                name="alphabetId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleAlphabetId(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.alphabetId && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Conversores</SelectLabel>
                        {alphabetsData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="relative col-span-1 mt-2">
              {/* <div className="flex">
                <Label htmlFor="length" className="font-semibold text-[16px]">
                  Extensão
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o número de caracteres que o conversor vai utilizar. Quanto maior o comprimento, maior o número de links possíveis de serem gerados sem repetição. (por default, deixar inativo. Somente deixar ativo se o cara escolher um conversor. Colocar na lista, em cada opção, o número de links possíveis de serem gerados)"
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Extensão
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='É o número de caracteres que o conversor vai utilizar. Quanto maior o comprimento, maior o número de links possíveis de serem gerados sem repetição. (por default, deixar inativo. Somente deixar ativo se o cara escolher um conversor. Colocar na lista, em cada opção, o número de links possíveis de serem gerados)'
                />
              </p>
              <Input
                id="length"
                type="number"
                min={6}
                max={40}
                value={lengthValue}
                onChange={handleLenghtChange}
              />
            </div>

            <div className="relative col-span-2 mt-2">
              {/* <div className="flex">
                <Label htmlFor="tag" className="font-semibold text-[16px]">
                  TAG
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Se quiser, você pode inserir uma TAG personalizada nas URLs geradas. Experimente preencher o campo e veja em "URL exemplo" uma simulação de como as URLs ficarão.'
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10">
                TAG
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='Se quiser, você pode inserir uma TAG personalizada nas URLs geradas. Experimente preencher o campo e veja em "URL exemplo" uma simulação de como as URLs ficarão.'
                />
              </p>
              
              <Input
                id="tag"
                type="text"
                placeholder="/personalização"
                {...register("tag")}
              />
            </div>

            <div className="relative col-span-2 mt-2">
              {/* <div className="flex">
                <p className="font-semibold">Posição TAG</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='As tags podem ser geradas antes ou depois dos dados convertidos. Veja "URL exemplo" para entender melhor.'
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10">
                Posição TAG
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='As tags podem ser geradas antes ou depois dos dados convertidos. Veja "URL exemplo" para entender melhor.'
                />
              </p>
              <Controller
                name="tagPosition"
                control={control}
                render={() => (
                  <Select
                    value={selectedTagPosition}
                    onValueChange={handleSelectedTagPosition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Posição da TAG" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Selecione a posição</SelectLabel>
                        <SelectItem value="before">Pré Conversor</SelectItem>
                        <SelectItem value="after">Pós Conversor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="relative col-span-4 mt-4">
              {/* <div className="flex">
                <p className="font-semibold">Conversor</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Este é um exemplo de como serão as URLs finais, segundo os parâmetros que você selecionou nos campos acima."
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10">
                URL exemplo
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content="Este é um exemplo de como serão as URLs finais, segundo os parâmetros que você selecionou nos campos acima."
                />
              </p>
              <div className="relative z-0">
                <Input
                  type="text"
                  disabled
                  value={
                    !selectedUrl && tagValue === ""
                      ? `https://exemplo.com/${generateLink()}`
                      : !selectedUrl &&
                        tagValue !== "" &&
                        selectedTagPosition === "before"
                      ? `https://exemplo.com/${tagValue}/${generateLink()}`
                      : !selectedUrl &&
                        tagValue !== "" &&
                        selectedTagPosition === "after"
                      ? `https://exemplo.com/${generateLink()}/${tagValue}`
                      : selectedUrl && tagValue === ""
                      ? `https://${selectedUrl}/${generateLink()}`
                      : selectedUrl &&
                        tagValue !== "" &&
                        selectedTagPosition === "before"
                      ? `https://${selectedUrl}/${tagValue}/${generateLink()}`
                      : selectedUrl &&
                        tagValue !== "" &&
                        selectedTagPosition === "after"
                      ? `https://${selectedUrl}/${generateLink()}/${tagValue}`
                      : ""
                  }
                />
              </div>
            </div>

            <div className="col-span-4 flex justify-center gap-1 border-b-2 mb-2 mt-4">
              <h1 className="flex items-center gap-2 uppercase font-bold pb-[10px]">
                <span className="flex items-center justify-center w-6 h-6 bg-[#a2d515] rounded-full dark:text-[#000000]">
                  3
                </span>
                Dados do disparo
              </h1>
            </div>

            <div className="relative col-span-4 mt-2">
              {/* <div className="flex">
                <p className="font-semibold">Url de destino</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o endereço (URL) final para onde o click deve ser direcionado."
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                URL de destino
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='É o endereço (URL) final para onde o click deve ser direcionado.'
                />
              </p>
              <Controller
                name="finalUrlId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFinalUrlId(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.finalUrlId && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>URL's de destino</SelectLabel>
                        {finalUrlsData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="col-span-4 mt-4">
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
                    <div className="flex">
                      <Label
                        htmlFor="qrCode"
                        className="text-[16px] text-nowrap cursor-pointer"
                      >
                        Gerar QRCode
                      </Label>
                      <TooltipTracker
                        side="right"
                        align="start"
                        content="Se quiser fazer uma campanha MOBILE, você também pode fazer o tracking dos links personalizados através de um QR Code para cada link que gerar. Os endereços das imagens desses códigos serão disponibilizadas na planilha criada pela plataforma, na coluna B."
                      />
                    </div>
                  </div>
                )}
              />
            </div>

            <Button
              variant={"secondary"}
              className="flex items-center gap-2 col-span-4 font-semibold mt-4 bg-[#7fa31d] hover:bg-[#a2d515]"
            >
              <Tag size={18} className="animate-pulse" />
              Gerar Tags
            </Button>
          </div>
        </form>

        {returnData && (
        <Dialog open={responseModalIsOpen} onOpenChange={handleCloseResponseModal}>
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
                  onClick={() => handleCopyToClipboard(returnData.link.url)}
                >
                  <span>{returnData.link.url}</span>
                  <Link2 size={18} className="ml-4" />
                </Button>
              </div>
              <div>
                <img
                  src={returnData.link.qrCode}
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

      </div>
    </>
  );
}
