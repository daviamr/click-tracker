import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";
import {
  baseProps,
  campaignData,
  conversorData,
  createTrackerC,
  customerData,
  dataAction,
  DataProps,
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
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { TooltipTracker } from "@/components/TooltipTracker";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CircleX, FileDown, Loader, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const verifyTrackerA = z.object({
  customer: z.string().min(1),
  campaign: z.string().min(1),
  actionId: z.string().min(1),
  // baseUrlId: z.string().min(1),
  alphabetId: z.string().min(1),
  url: z.string().min(1),
  replace: z.string(),
  sheet: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "*Arquivo não selecionado.",
    }),
  length: z.string(),
  qrCode: z.boolean(),
  // finalUrlId: z.string().min(1),
  dataSourceId: z.string().min(1),
  tag: z.string(),
  tagPosition: z.string(),
  // lpId: z.string().min(1),
});

type trackerCData = z.infer<typeof verifyTrackerA>;
type trackerCProps = {
  data: DataProps;
  handleTrackerC: ({
    actionId,
    alphabetId,
    url,
    replace,
    sheet,
    length,
    qrCode,
    dataSourceId,
    tag,
    tagPosition,
  }: createTrackerC) => void;
};

export function TrackerC() {
  const { data, handleTrackerC } = useAuth() as trackerCProps;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<trackerCData>({
    resolver: zodResolver(verifyTrackerA),
    defaultValues: {
      actionId: "",
      url: "",
      replace: "",
      alphabetId: "",
      sheet: null,
      length: "6",
      qrCode: false,
      dataSourceId: "",
      tag: "",
      tagPosition: "",
    },
  });
  const [customersData, setCustomersData] = useState<customerData[]>([]);
  const [campaignsData, setCampaignsData] = useState<campaignData[]>([]);
  const [actionsData, setActionsData] = useState<dataAction[]>([]);
  const [alphabetsData, setAlphabets] = useState<conversorData[]>([]);
  const [dataSourcesData, setDataSourcesData] = useState<baseProps[]>([]);
  const [selectedCustomer, handleSelectedCustomer] = useState<string>("");
  const [selectedCampaign, handleSelectedCampaign] = useState<string>("");
  const [selectedAction, handleSelectedAction] = useState<string>("");
  const [lengthValue, setLengthValue] = useState<number>(6);
  const [selectedTagPosition, setSelectedTagPosition] = useState<string>("");
  //for the input example url
  // const charactersLength = [
  //   "a",
  //   "b",
  //   "c",
  //   "d",
  //   "e",
  //   "f",
  //   "g",
  //   "h",
  //   "i",
  //   "j",
  //   "k",
  //   "l",
  //   "m",
  //   "n",
  //   "o",
  //   "p",
  //   "q",
  //   "r",
  //   "s",
  //   "t",
  // ];
  // const tagValue = watch("tag");
  //
  //loading manipulations
  const [loading, setLoading] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<string>("loading");

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
  const handleActionId = (value: string) => {
    const actionId =
      actionsData.find((action) => action.name === value)?.id ||
      "Id da ação não encontrada.";
    handleSelectedAction(actionId.toString());
    setValue("actionId", actionId.toString());
    console.log("Id da ação: " + actionId + selectedAction);
  };
  const handleAlphabetId = (value: string) => {
    const alphabetId =
      alphabetsData.find((alphabet) => alphabet.name === value)?.id ||
      "Id do conversor não encontrado ou é nulo.";
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
  //for the input example url
  // const generateLink = () => {
  //   return charactersLength.slice(0, lengthValue).join("");
  // };
  //
  const handleDataSourceId = (value: string) => {
    const dataSourceId =
      dataSourcesData.find((base) => base.url === value)?.id ||
      "Id da origem base não encontrado.";
    if (dataSourceId) {
      setValue("dataSourceId", dataSourceId.toString());
      console.log("Id da origem base: " + dataSourceId);
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
  const handleGetActions = async () => {
    try {
      const response = await api.get(
        `/actions?campaignId=${selectedCampaign}`,
        {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        }
      );
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
  const handleGetDataSources = async () => {
    try {
      const response = await api.get(`/data-sources`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setDataSourcesData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as Origem Bases, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  //useeffects
  useEffect(() => {
    handleGetUsers();
    handleGetAlphabets();
    handleGetDataSources();
  }, [data.jwtToken]);
  useEffect(() => {
    if (selectedCustomer) {
      handleGetCampaigns();
    }
    if (selectedCampaign) {
      handleGetActions();
    }
  }, [selectedCustomer, selectedCampaign]);

  //create
  async function createTrackerC(data: trackerCData) {
    setLoading(true);
    setRequestStatus("loading");
    try {
      const {
        actionId,
        url,
        replace,
        alphabetId,
        sheet,
        length,
        qrCode,
        dataSourceId,
        tag,
        tagPosition,
      } = data;

      const file = sheet instanceof FileList ? sheet[0] : sheet;
      if (!file) {
        console.error("Nenhum arquivo foi selecionado.");
        return;
      }

      await handleTrackerC({
        actionId,
        url,
        replace,
        alphabetId,
        sheet: file,
        length,
        qrCode: qrCode.toString(),
        dataSourceId,
        tag,
        tagPosition,
      });
    } catch (error) {
      console.log("Erro: ", error);
      setRequestStatus("error");
    } finally {
      reset();
      setRequestStatus("success");
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }
  console.log(errors);
  return (
    <>
      <div className="relative p-8 bg-transparent rounded-md border border-input w-[601px]">
        <form onSubmit={handleSubmit(createTrackerC)}>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-4 flex justify-center gap-1 border-b-2 mb-2">
              <h1 className="flex items-center gap-2 uppercase font-bold pb-[10px]">
                <span className="flex items-center justify-center w-6 h-6 bg-[#a2d515] rounded-full dark:text-[#000000]">
                  1
                </span>
                Dados da ação
              </h1>
              <TooltipTracker
                side="right"
                align="start"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quos, magni dolor, beatae voluptatibus ipsa rem similique minus ut porro quo commodi obcaecati provident dolore molestiae, maxime hic? Error, eum!"
              />
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

            <div className="relative col-span-4 mt-2">
              <p
                className={`absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10 ${
                  !selectedCampaign ? "opacity-80" : ""
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
                      disabled={!selectedCampaign || actionsData.length === 0}
                    >
                      <SelectTrigger
                        className={`${errors.actionId && "border-rose-400"}`}
                      >
                        <SelectValue
                          placeholder={
                            !selectedCampaign
                              ? "Campanha não selecionada"
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
              <TooltipTracker
                side="right"
                align="start"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quos, magni dolor, beatae voluptatibus ipsa rem similique minus ut porro quo commodi obcaecati provident dolore molestiae, maxime hic? Error, eum!"
              />
            </div>

            <div className="relative col-span-3 mt-2">
              {/* <div className="flex">
                <Label htmlFor="length" className="font-semibold text-[16px]">
                  URL
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o endereço (URL) final para onde o click deve ser direcionado."
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                URL de destino
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content="É o endereço (URL) final para onde o click deve ser direcionado."
                />
              </p>
              <Input id="url" type="url" placeholder="https://" {...register("url")} className={`${errors.url && "border-rose-400"}`}/>
            </div>

            <div className="relative col-span-1 mt-2">
              {/* <div className="flex">
                <Label htmlFor="length" className="font-semibold text-[16px]">
                  Parâmetro
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="LOREM LOREM LOREM"
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Parâmetro
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content="LOREM LOREM LOREM"
                />
              </p>
              <Input id="replace" type="text" placeholder="{r}" {...register("replace")} className={`${errors.replace && "border-rose-400"}`}/>
            </div>

            <div className="relative col-span-3 mt-2">
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
                        <SelectItem value="Nenhum">Nenhum</SelectItem>
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
                  content="É o número de caracteres que o conversor vai utilizar. Quanto maior o comprimento, maior o número de links possíveis de serem gerados sem repetição. (por default, deixar inativo. Somente deixar ativo se o cara escolher um conversor. Colocar na lista, em cada opção, o número de links possíveis de serem gerados)"
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
                disabled
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
                    disabled
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
                <Input type="text" disabled />
              </div>
            </div>

            <div className="col-span-4 flex justify-center gap-1 border-b-2 mb-2 mt-4">
              <h1 className="flex items-center gap-2 uppercase font-bold pb-[10px]">
                <span className="flex items-center justify-center w-6 h-6 bg-[#a2d515] rounded-full dark:text-[#000000]">
                  3
                </span>
                Dados do disparo
              </h1>
              <TooltipTracker
                side="right"
                align="start"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quos, magni dolor, beatae voluptatibus ipsa rem similique minus ut porro quo commodi obcaecati provident dolore molestiae, maxime hic? Error, eum!"
              />
            </div>

            <div className="relative col-span-2 mt-2">
              {/* <div className="flex">
                <Label htmlFor="sheet" className="font-semibold text-[16px]">
                  Planilha
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Carregue a planilha com os dados que você deseja fazer o tracking. É necessário que a planilha siga o arquivo de exemplo. Clique em "download de planilha exemplo" para visualizar.'
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-2 text-xs font-semibold z-10 leading-3">
                Base
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content='Carregue a planilha com os dados que você deseja fazer o tracking. É necessário que a planilha siga o arquivo de exemplo. Clique em "download de planilha exemplo" para visualizar.'
                />
              </p>

              <input
                id="sheet"
                type="file"
                className={`border border-input rounded-md pt-1 max-w-[263.5px] col-span-2 ${
                  errors.sheet && "border-rose-400"
                }`}
                {...register("sheet")}
              />
            </div>

            <div className="relative col-span-1 mt-2">
              {/* <div className="flex">
                <p className="font-semibold">Origem Base</p>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="LOREM LOREM LOREM"
                />
              </div> */}
              <p className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Origem Base
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content="LOREM LOREM LOREM"
                />
              </p>
              <Controller
                name="dataSourceId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDataSourceId(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.dataSourceId && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Origem Bases</SelectLabel>
                        {dataSourcesData.map((i, index) => (
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
                <Label className="text-[16px]">Exemplo</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Baixe uma planilha exemplo."
                />
              </div> */}
              <p className="absolute px-2 bg-background rounded-sm leading-3 -top-2 left-1 text-xs font-semibold">
                Exemplo
                <TooltipTracker
                  className="absolute -right-3 -top-1"
                  side="right"
                  align="start"
                  content="LOREM LOREM LOREM"
                />
              </p>
              <Button variant={"secondary"} type="button">
                Download
              </Button>
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
              className="flex items-center gap-2 col-span-4 font-semibold mt-4"
            >
              <Tag size={18} className="animate-pulse" />
              Tags
            </Button>
          </div>
        </form>
        {loading && (
          <div
            className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20 w-[460px] h-[300px] p-4 bg-background rounded-md border border-input flex flex-col justify-center `}
          >
            <div
              className={`relative -top-[64px] flex justify-end ${
                requestStatus === "success" ? "" : "hidden"
              }`}
            >
              <ArrowUpRight size={38} />
            </div>
            <div className={`flex flex-col gap-2 items-center`}>
              {requestStatus === "loading" && (
                <Loader size={60} className="animate-spin" />
              )}
              {requestStatus === "error" && <CircleX size={60} />}
              {requestStatus === "success" && <FileDown size={60} />}
              <p className={`text-xl`}>
                {requestStatus === "loading" && (
                  <span className="animate-pulse">Gerando planilha...</span>
                )}
                {requestStatus === "error" && (
                  <span>Ops, algo deu errado!</span>
                )}
                {requestStatus === "success" && (
                  <span className="animate-pulse">
                    Fazendo o download da planilha...
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
