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
import { FileCheck2, FilePlus2 } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { AlertMessage } from "../alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  createNewAction,
  customerData,
  DataProps,
  lpsData,
} from "@/interface/auth";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyCreateAction = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  selectCliente: z.string().min(1, ""),
  startAt: z.string().min(1, "*Campo obrigatório"),
  endAt: z.string().min(1, "*Campo obrigatório"),
  utm: z.string().min(1, "*Campo obrigatório"),
  cost: z.string().min(1, "*Campo obrigatório"),
  key: z.string().min(1, "*Campo obrigatório"),
  landingPage: z.string(),
  landingPageId: z.number().min(1, "*Campo obrigatório"),
});

type actionData = z.infer<typeof verifyCreateAction>;
type HandleCreateUsersProps = {
  handleCreateAction: ({
    name,
    campaignId,
    startAt,
    endAt,
    utm,
    cost,
    landingPageId,
    key,
  }: createNewAction) => void;
  data: DataProps;
};

type createActionProps = {
  onCreateAction: () => void;
};

export function NovaAcao({ onCreateAction }: createActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleCreateAction } = useAuth() as HandleCreateUsersProps;
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [lps, setLPs] = useState<lpsData[]>([]);
  // const [isChecked, setIsChecked] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [utm, setUtm] = useState<string>("utm_source");
  const [chave, setChave] = useState<string>("");
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
      name: "",
      campaignId: 0,
      selectCliente: "",
      startAt: "",
      endAt: "",
      utm: utm,
      cost: "",
      key: "",
    },
  });

  const [costValue, setCostValue] = useState<string>("");

  const formatToBRLCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/[^0-9]/g, '');

    // Retorna uma string vazia se o campo estiver vazio
    if (!numericValue) return "";

    // Converte para número e formata para o estilo brasileiro
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
      setSelectedClient(value);
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
    reset();
    setSelectedClient('');
    setCostValue('');
  }, [isOpen]);

  const createAction = async (data: actionData) => {
    const { name, campaignId, startAt, endAt, utm, landingPageId } = data;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();
    const costFormatado = costValue.replace(/\./g, '').replace(',', '.');

    if (campaignId === 0) {
      alert("Campanha não encontrada.");
    } else {
      try {
        await handleCreateAction({
          name,
          campaignId,
          startAt: inicioIso,
          endAt: fimIso,
          utm: utm,
          cost: Number(costFormatado),
          landingPageId,
          key: chave,
        });
        console.log({
          name,
          campaignId,
          startAt: inicioIso,
          endAt: fimIso,
          utm: utm,
          cost: Number(costFormatado),
          landingPageId,
          key: chave,
        });
        onCreateAction();
        setIsOpen(false);
        reset();
      } catch (error) {
        console.error("Erro ao criar ação:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <FilePlus2 size={18} />
          Criar Ação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Ação</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createAction)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="selectCliente">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
                name="selectCliente"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectChange(value);
                    }}
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
            <div className="col-span-4">
              <Label htmlFor="campanha">Campanha</Label>
              <Select
                disabled={!selectedClient}
                onValueChange={handleSelectCampaign}
              >
                <SelectTrigger
                  className={`${errors.campaignId && "border-rose-400"}`}
                >
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
            </div>
            <div className="col-span-3">
              <Label htmlFor="lprelacionada">LP Relacionada</Label>
              <Controller
                name="landingPage"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      handleSelectLP(value);
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a LP" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.landingPageId && "border-rose-400"}`}>
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
            <div className="col-span-1">
              <Label htmlFor="cost">Custo</Label>
              <Input
                id="cost"
                type="text"
                placeholder="0,99"
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
            <div className="col-span-2">
              <Label htmlFor="utm">UTM</Label>
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
                    defaultValue="utm_source"
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
            <div className="col-span-2">
              <Label htmlFor="key">Chave</Label>
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
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
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
            <div className="col-span-2">
              <Label id="dataInicio">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400"}`}
              />
            </div>
            <div className="col-span-2">
              <Label id="dataFim">Data/Hora Fim</Label>
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
