import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileCheck2, FilePenLine } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { AlertMessage } from "../alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  customerData,
  DataProps,
  editAction,
  lpsData,
} from "@/interface/auth";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyCreateAction = z.object({
  id: z.number(),
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  selectCliente: z.string(),
  startAt: z.string().min(1, "*Campo obrigatório"),
  endAt: z.string().min(1, "*Campo obrigatório"),
  utm: z.string().min(1, "*Campo obrigatório"),
  cost: z.string().min(1, "*Campo obrigatório"),
  key: z.string().min(1, "*Campo obrigatório"),
  landingPage: z.string(),
  landingPageId: z.number().min(1, "*Campo obrigatório"),
  media: z.string(),
});

type actionData = z.infer<typeof verifyCreateAction>;
type hnadleEditActionProps = {
  handleEditAction: ({
    id,
    name,
    campaignId,
    startAt,
    endAt,
    utm,
    cost,
    landingPageId,
    key,
    media
  }: editAction) => void;
  data: DataProps;
};

type editActionProps = {
  id: number;
  client: string;
  campaign: string;
  lp: string;
  cost: number;
  action: string;
  dataInicio: string;
  dataFim: string;
  media: string;
  onEditAction: () => void;
};

export function EditarAcao({
  id,
  client,
  campaign,
  lp,
  cost,
  action,
  dataInicio,
  dataFim,
  media,
  onEditAction,
}: editActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleEditAction } = useAuth() as hnadleEditActionProps;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [lps, setLPs] = useState<lpsData[]>([]);
  // const [isChecked, setIsChecked] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [utm, setUtm] = useState<string>("utm_source");
  const [chave, setChave] = useState<string>("");
  // const [idCampaign, setIdCampaign] = useState<number>(0);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<actionData>({
    resolver: zodResolver(verifyCreateAction),
    defaultValues: {
      id,
      landingPage: lp,
      utm: utm,
    },
  });
  const dataPadraoFormatada = (data: string) => {
    return data.slice(0, 16);
  };
  const [costValue, setCostValue] = useState<string>("");

  const formatToBRLCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/[^0-9]/g, "");

    // Retorna uma string vazia se o campo estiver vazio
    if (!numericValue) return "";

    // Converte para número e formata para o estilo brasileiro
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(numericValue) / 100);

    return formattedValue;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCostValue(formatToBRLCurrency(value));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedChars = /[0-9,]/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleSelectChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
    }
  };

  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
    }
  };

  const handleSelectLP = (value: string) => {
    const selectedLP = lps.find((lp) => lp.name === value);
    if (selectedLP) {
      setValue("landingPageId", selectedLP.id);
    }
  };

  const handleGetClient = async () => {
    try {
      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomerData(response.data);
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

  useEffect(() => {
    handleGetClient();
    handleGetLP();
  }, [data.jwtToken]);

  useEffect(() => {
    async function handleGetSingleClient() {
      try {
        const response = await api.get(`/campaigns?clientId=${clientId}`, {
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
    }
    if (clientId) {
      handleGetSingleClient();
    }
  }, [clientId]);

  useEffect(() => {
    if (isOpen) {
      const costString =
        typeof cost === "number" && Number.isInteger(cost)
          ? `${cost}00`
          : cost.toString();
      reset({
        id: id,
        campaignId: 1,
        selectCliente: client,
        name: action,
        landingPage: lp,
        utm: utm,
        media: media,
        startAt: dataPadraoFormatada(dataInicio),
        endAt: dataPadraoFormatada(dataFim),
      });
      handleSelectChange(client);
      handleSelectLP(lp);
      handleSelectCampaign(campaign);
      setCostValue(formatToBRLCurrency(costString));
      setUtm("utm_source");
    }
  }, [isOpen]);

  const editAction = async (data: actionData) => {
    const { name, campaignId, startAt, endAt, utm, landingPageId, media } = data;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();
    const costFormatado = costValue.replace(/\./g, "").replace(",", ".");

    if (campaignId === 0) {
      alert("Campanha não encontrada.");
    } else {
      try {
        await handleEditAction({
          id,
          name,
          campaignId,
          startAt: inicioIso,
          endAt: fimIso,
          utm: utm,
          cost: Number(costFormatado),
          landingPageId: landingPageId,
          key: chave,
          media,
        });
        onEditAction();
        setIsOpen(false);
        reset();
      } catch (error) {
        console.error("Erro ao editar ação:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Editar Ação</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(editAction)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
                name="selectCliente"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={client}
                    disabled
                  >
                    <SelectTrigger
                      className={`${errors.selectCliente && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {customerData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT CUSTOMER */}
            </div>

            <div className="relative col-span-4">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Campanha</Label>
              <Select
                onValueChange={handleSelectCampaign}
                defaultValue={campaign}
              >
                <SelectTrigger
                  className={`${errors.campaignId && "border-rose-400"}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Campanhas</SelectLabel>
                    {campanhas.map((i) => (
                      <SelectItem value={i.name} key={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="relative col-span-3">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">LP Relacionada</Label>
              <Controller
                name="landingPage"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      handleSelectLP(value);
                      field.onChange(value);
                    }}
                    defaultValue={lp}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a LP" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.landingPageId}`}>
                      <SelectGroup>
                        <SelectLabel>LP's</SelectLabel>
                        {lps.map((i, index) => (
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

            <div className="relative col-span-1">
              <Label htmlFor="cost" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Custo</Label>
              <Input
                id="cost"
                type="text"
                {...register("cost", {
                  onChange: (e) => {
                    setCostValue(e.target.value);
                  },
                })}
                value={costValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`${errors.cost && "border-rose-400"}`}
              />
            </div>

            <div className="relative col-span-2">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">UTM</Label>
              {/* SELECT UTM */}
              <Controller
                name="utm"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                      setUtm(value);
                    }}
                    defaultValue={utm}
                  >
                    <SelectTrigger
                      className={`${errors.utm && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Chaves</SelectLabel>
                        <SelectItem value="utm_source">utm_source</SelectItem>
                        <SelectItem value="utm_medium">utm_medium</SelectItem>
                        <SelectItem value="utm_campaign">
                          utm_campaign
                        </SelectItem>
                        <SelectItem value="utm_turn">utm_turn</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT UTM */}
            </div>

            <div className="relative col-span-2">
              <Label className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Chave</Label>
              {/* SELECT KEY */}

              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                      setChave(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.key && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {utm === "utm_source" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="instagram">instagram</SelectItem>
                          <SelectItem value="inbound">inbound</SelectItem>
                          <SelectItem value="google">google</SelectItem>
                          <SelectItem value="emkt">emkt</SelectItem>
                          <SelectItem value="facebook">facebook</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_medium" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="shifters">shifters</SelectItem>
                          <SelectItem value="bd">bd</SelectItem>
                          <SelectItem value="cpc">cpc</SelectItem>
                          <SelectItem value="selecoes">selecoes</SelectItem>
                          <SelectItem value="pinup">pinup</SelectItem>
                          <SelectItem value="inbox">inbox</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_campaign" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="form">form</SelectItem>
                          <SelectItem value="display">display</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_turn" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT KEY */}
            </div>

            <div className="relative col-span-2">
              <Label htmlFor="nome" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Mídia
              </Label>
              {/* SELECT MEDIA */}
              <Controller
                name="media"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                    }}
                    defaultValue={media}
                  >
                    <SelectTrigger
                      className={`${errors.media && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Chaves</SelectLabel>
                        <SelectItem value="Mail mkt">Mail mkt</SelectItem>
                        <SelectItem value="Push">Push</SelectItem>
                        <SelectItem value="Display">Display</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="Whatsapp">Whatsapp</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT MEDIA */}
            </div>

            <div className="relative col-span-2">
              <Label htmlFor="nome" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Ação
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite a ação..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
              />
            </div>

            <div className="relative col-span-2">
              <Label id="dataInicio" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400"}`}
              />
            </div>

            <div className="relative col-span-2">
              <Label id="dataFim" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Data/Hora Fim</Label>
              <Input
                id="dataFim"
                type="datetime-local"
                {...register("endAt")}
                className={`${errors.endAt && "border-rose-400"}`}
              />
            </div>

            <input
              type="hidden"
              {...register("campaignId", { valueAsNumber: true })}
            />
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2 mt-6"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <FileCheck2 size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
