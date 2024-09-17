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
  campaignData,
  conversorData,
  createNewLink,
  customerData,
  dataAction,
  DataProps,
  urlData,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { AxiosError } from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BarraProgresso } from "@/components/BarraProgresso";
import { SelectLP } from "@/components/SelectLP";
import { TooltipTracker } from "@/components/TooltipTracker";

const verifyCreateLink = z.object({
  customer: z.string().min(1, ""),
  campaignId: z.number().min(1, ""),
  actionId: z.number().min(1, ""),
  baseUrlId: z.number().min(1, ""),
  alphabetId: z.number().min(1, ""),
  redirectUrl: z.string().min(4, "*Digite uma url válida"),
  replace: z.string().min(2, "*Mínimo de 2 caracteres."),
  sheet: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "*Selecione um arquivo",
    }),
  length: z.number(),
  qrCode: z.boolean(),
  conversionPosition: z.string(),
});

type encurtadorDados = z.infer<typeof verifyCreateLink>;

type HandleCreateLinkProps = {
  handleCreateLink: ({
    actionId,
    baseUrlId,
    alphabetId,
    redirectUrl,
    replace,
    sheet,
    length,
    qrCode,
  }: createNewLink) => void;
  data: DataProps;
};

export function EncutadorUm() {
  const { data, handleCreateLink } = useAuth() as HandleCreateLinkProps;
  const [clients, setClients] = useState<customerData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [isSelectedCampaign, setIsSelectedCampaign] = useState<boolean>(false);
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");
  const [valorPersonalizarUrl, setValorPersonalizarUrl] = useState<string>("");
  const [selectedPositionValue, setselectedPositionValue] = useState("pre");

  //Auxiliares
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
      console.log(selectedCampaign);
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

  //Hooks
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

  //Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<encurtadorDados>({
    resolver: zodResolver(verifyCreateLink),
    defaultValues: {
      actionId: 0,
      baseUrlId: 0,
      redirectUrl: "",
      replace: "",
      sheet: null,
      length: 6,
      qrCode: false,
    },
  });

  //Assistindo o valor do input de personalizar url
  const valorAssistido = watch("replace");

  useEffect(() => {
    setValorPersonalizarUrl(valorPersonalizarUrl || "");
  }, [valorAssistido]);

  async function createLink(data: encurtadorDados) {
    setLoading(true);
    setProgress(20);
    try {
      const {
        actionId,
        baseUrlId,
        alphabetId,
        redirectUrl,
        replace,
        sheet,
        length,
        qrCode,
      } = data;
      setProgress(50);

      const file = sheet instanceof FileList ? sheet[0] : sheet;
      if (!file) {
        console.error("Nenhum arquivo foi selecionado.");
        return;
      }

      await handleCreateLink({
        actionId,
        baseUrlId,
        alphabetId,
        redirectUrl,
        replace,
        sheet: file,
        length,
        qrCode,
      });
    } catch (error) {
      console.log("Erro:", error);
    } finally {
      setLoading(false);
      reset();
    }
  }

  return (
    <>
      <div className="pt-[16px] px-8 bg-transparent rounded-md border border-input w-[601px] m-auto">
        <h1 className="text-[14px] w-max m-auto pb-6 max-w-[540px]">
          Utilize esta opção para gerar uma planilha com links individualizados
          e personalizados, permitindo acompanhar exatamente qual destinatário
          clicou em cada link. A geração de relatórios pode ser feita tanto
          click a click - com registro de data/hora/IP e fingerprint de cada
          click, - quanto através da totalização de dados, segmentada por
          cliente, campanha, LP/Site/Portal e/ou ação.
        </h1>
        <form onSubmit={handleSubmit(createLink)}>
          <div className="grid grid-cols-4 gap-[12px] max-w-[601px]">
            <div className="col-span-4">
              <p className="uppercase font-bold pb-1 pt-4">Dados da ação:</p>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <Label className="font-semibold">Cliente</Label>
              </div>
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
              <div className="flex">
                <Label className="font-semibold">Campanha</Label>
              </div>
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
              <div className="flex">
                <Label className="font-semibold">LP</Label>
              </div>
              <SelectLP />
            </div>
            <div className="col-span-2">
              <div className="flex">
                <Label className="font-semibold">Ação</Label>
              </div>
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
              <p className="uppercase font-bold pb-1 pt-4">Encurtador:</p>
            </div>
            <div className="col-span-1">
              <div className="flex">
                <Label className="font-semibold">ShortURL</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Você pode escolher qualquer uma das shortURLs da lista para gerar seus links personalizados. Veja em "URL exemplo" para visualizar o formato que os links serão gerados.'
                />
              </div>
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
            <div className="col-span-2">
              {/* SELECT CONVERSOR */}
              <div className="flex">
                <Label className="font-semibold">Conversor</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Caso queira gerar uma URL encurtada, é necessário selecionar um conversor. Cada protocolo é compatível com um tipo de conversor diferente. Se não quiser usar um conversor, a plataforma vai simplesmente inserir o dado presente na coluna "A" da planilha enviada para gerar os links de tracking.'
                />
              </div>
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
              <div className="flex">
                <Label className="font-semibold">Comprimento</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o número de caracteres que o conversor vai utilizar. Quanto maior o comprimento, maior o número de links possíveis de serem gerados sem repetição. (por default, deixar inativo. Somente deixar ativo se o cara escolher um conversor. Colocar na lista, em cada opção, o número de links possíveis de serem gerados)"
                />
              </div>
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
            <div className="flex flex-col gap-1 col-span-2">
              <div className="flex">
                <Label className="font-semibold" htmlFor="personalizarUrl">
                  TAGs
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Se quiser, você pode inserir uma TAG personalizada nas URLs geradas. Experimente preencher o campo e veja em "URL exemplo" uma simulação de como as URLs ficarão.'
                />
              </div>
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
              <div className="flex">
                <Label className="font-semibold">Posição TAG</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='As tags podem ser geradas antes ou depois dos dados convertidos. Veja "URL exemplo" para entender melhor.'
                />
              </div>
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
              <div className="flex">
                <Label className="font-bold">URL exemplo</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Este é um exemplo de como serão as URLs finais, segundo os parâmetros que você selecionou nos campos acima."
                />
              </div>
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
            <div className="flex flex-col gap-1 col-span-3">
              <div className="flex">
                <Label className="font-semibold" htmlFor="planilha">
                  Planilha
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Carregue a planilha com os dados que você deseja fazer o tracking. É necessário que a planilha siga o arquivo de exemplo. Clique em "download de planilha exemplo" para visualizar.'
                />
              </div>
              <input
                type="file"
                id="planilha"
                {...register("sheet")}
                className={`cursor-pointer p-1 bg-transparent rounded-md border border-input col-span-4 ${
                  errors.sheet && "border-rose-400 bg-rose-100"
                }"col-span-4"`}
              />
              {errors.sheet && (
                <span className="col-span-4 text-nowrap text-xs text-rose-400 font-normal">
                  {typeof errors.sheet.message === "string"
                    ? errors.sheet.message
                    : ""}
                </span>
              )}
            </div>
            <div className="col-span-1 flex flex-col items-left justify-end">
              <div className="flex">
                <Label>Exemplo</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Baixe uma planilha exemplo."
                />
              </div>
              <Button variant={"outline"}>Download</Button>
            </div>
            <div className="flex flex-col gap-1 col-span-4">
              <div className="flex">
                <Label className="font-semibold" htmlFor="urlFinal">
                  URL de destino
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o endereço (URL) final para onde o click deve ser direcionado."
                />
              </div>
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
            <div className="col-span-4">
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
                        className="text-nowrap cursor-pointer"
                      >
                        Gerar QRCode
                      </Label>
                      <TooltipTracker
                        side="right"
                        align="start"
                        content="Se quiser fazer uma campanha MOBILE, você também pode fazer o tracking dos links personalizados através de um QR Code para cada link que gerar. Os endereços das imagens desses códigos serão disponibilizadas na planilha criada pela plataforma, na coluna B."
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="pb-6 text-right mt-8 max-w-[601px]">
            <Button className="w-full" variant="secondary" disabled={loading}>
              <div className="flex items-center gap-2">
                <Send size={18} />
                {loading ? "Enviando..." : "Enviar"}
              </div>
            </Button>
          </div>
        </form>
        {/* ProgressBar */}
        <div className="col-span-4 pb-6">
          {loading && <BarraProgresso value={progress} />}
        </div>
      </div>
    </>
  );
}
